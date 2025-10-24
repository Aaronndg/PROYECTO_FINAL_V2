// Configuración del bot de Telegram
export const TELEGRAM_CONFIG = {
  BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  WEBHOOK_URL: process.env.TELEGRAM_WEBHOOK_URL || 'https://serenia.app/api/telegram/webhook',
  API_URL: `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`,
}

// Tipos para el bot
export interface TelegramUser {
  id: number
  is_bot: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

export interface TelegramChat {
  id: number
  type: 'private' | 'group' | 'supergroup' | 'channel'
  title?: string
  username?: string
  first_name?: string
  last_name?: string
}

export interface TelegramMessage {
  message_id: number
  from?: TelegramUser
  chat: TelegramChat
  date: number
  text?: string
  entities?: TelegramMessageEntity[]
}

export interface TelegramMessageEntity {
  type: string
  offset: number
  length: number
  url?: string
  user?: TelegramUser
}

export interface TelegramCallbackQuery {
  id: string
  from: TelegramUser
  message?: TelegramMessage
  data?: string
}

export interface TelegramUpdate {
  update_id: number
  message?: TelegramMessage
  edited_message?: TelegramMessage
  callback_query?: TelegramCallbackQuery
}

// Utilidades para el bot
export class TelegramBotUtils {
  private static readonly API_URL = TELEGRAM_CONFIG.API_URL

  static async sendMessage(
    chatId: number,
    text: string,
    options: {
      parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2'
      reply_markup?: any
      disable_web_page_preview?: boolean
    } = {}
  ) {
    const payload = {
      chat_id: chatId,
      text,
      parse_mode: options.parse_mode || 'Markdown',
      reply_markup: options.reply_markup,
      disable_web_page_preview: options.disable_web_page_preview || false
    }

    return this.makeRequest('sendMessage', payload)
  }

  static async editMessage(
    chatId: number,
    messageId: number,
    text: string,
    options: {
      parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2'
      reply_markup?: any
    } = {}
  ) {
    const payload = {
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: options.parse_mode || 'Markdown',
      reply_markup: options.reply_markup
    }

    return this.makeRequest('editMessageText', payload)
  }

  static async deleteMessage(chatId: number, messageId: number) {
    const payload = {
      chat_id: chatId,
      message_id: messageId
    }

    return this.makeRequest('deleteMessage', payload)
  }

  static async sendChatAction(chatId: number, action: 'typing' | 'upload_photo' | 'record_video' | 'upload_video' | 'record_voice' | 'upload_voice' | 'upload_document' | 'find_location' | 'record_video_note' | 'upload_video_note') {
    const payload = {
      chat_id: chatId,
      action
    }

    return this.makeRequest('sendChatAction', payload)
  }

  static async answerCallbackQuery(
    callbackQueryId: string,
    options: {
      text?: string
      show_alert?: boolean
      url?: string
    } = {}
  ) {
    const payload = {
      callback_query_id: callbackQueryId,
      text: options.text,
      show_alert: options.show_alert || false,
      url: options.url
    }

    return this.makeRequest('answerCallbackQuery', payload)
  }

  static async setWebhook(url: string) {
    const payload = {
      url,
      drop_pending_updates: true
    }

    return this.makeRequest('setWebhook', payload)
  }

  static async deleteWebhook() {
    return this.makeRequest('deleteWebhook', {})
  }

  static async getWebhookInfo() {
    return this.makeRequest('getWebhookInfo', {})
  }

  private static async makeRequest(method: string, payload: any) {
    if (!TELEGRAM_CONFIG.BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN no está configurado')
    }

    const url = `${this.API_URL}/${method}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Telegram API error (${response.status}): ${errorText}`)
    }

    return response.json()
  }

  // Keyboards predefinidos
  static getMainMenuKeyboard() {
    return {
      inline_keyboard: [
        [
          { text: '📖 Versículo del día', callback_data: 'cmd_verse' },
          { text: '💙 ¿Cómo estás?', callback_data: 'cmd_mood' }
        ],
        [
          { text: '🙏 Momento de oración', callback_data: 'cmd_prayer' },
          { text: '📊 Test rápido', callback_data: 'cmd_test' }
        ],
        [
          { text: '👥 Comunidad', callback_data: 'cmd_community' },
          { text: '⏰ Recordatorios', callback_data: 'cmd_reminders' }
        ]
      ]
    }
  }

  static getMoodKeyboard() {
    return {
      inline_keyboard: [
        [
          { text: '😊 Excelente', callback_data: 'mood_5' },
          { text: '🙂 Bien', callback_data: 'mood_4' }
        ],
        [
          { text: '😐 Regular', callback_data: 'mood_3' },
          { text: '😔 Mal', callback_data: 'mood_2' }
        ],
        [
          { text: '😢 Muy mal', callback_data: 'mood_1' }
        ]
      ]
    }
  }

  static getStressKeyboard() {
    return {
      inline_keyboard: [
        [
          { text: '1 - Nada', callback_data: 'stress_1' },
          { text: '2 - Poco', callback_data: 'stress_2' },
          { text: '3 - Moderado', callback_data: 'stress_3' }
        ],
        [
          { text: '4 - Bastante', callback_data: 'stress_4' },
          { text: '5 - Mucho', callback_data: 'stress_5' }
        ]
      ]
    }
  }

  static getReminderKeyboard() {
    return {
      inline_keyboard: [
        [
          { text: '📖 Versículo diario', callback_data: 'reminder_verse' },
          { text: '🙏 Oración matutina', callback_data: 'reminder_prayer' }
        ],
        [
          { text: '💙 Check-in emocional', callback_data: 'reminder_mood' },
          { text: '📊 Evaluación semanal', callback_data: 'reminder_weekly' }
        ],
        [
          { text: '⚙️ Configurar horarios', callback_data: 'reminder_config' }
        ]
      ]
    }
  }

  // Utilidades de formato
  static escapeMarkdown(text: string): string {
    return text.replace(/[_*[\]()~`>#+=|{}.!-]/g, '\\$&')
  }

  static formatUserMention(user: TelegramUser): string {
    const name = this.escapeMarkdown(user.first_name)
    return user.username ? `@${user.username}` : name
  }

  static truncateText(text: string, maxLength: number = 4096): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength - 3) + '...'
  }
}

// Respuestas predefinidas
export const BOT_RESPONSES = {
  WELCOME: `
🙏 *¡Bienvenido a SerenIA!*

Soy tu asistente espiritual y de bienestar. Estoy aquí para acompañarte en tu crecimiento espiritual y emocional con sabiduría bíblica.

✨ *¿Qué puedo hacer por ti?*
• Compartir versículos diarios personalizados
• Ayudarte con reflexiones y oraciones
• Realizar evaluaciones de bienestar rápidas
• Conectarte with la comunidad cristiana
• Enviarte recordatorios de cuidado espiritual

💬 Puedes escribirme libremente o usar los botones de abajo.

¿Cómo puedo acompañarte hoy? 🤗
`,

  HELP: `
📖 *Comandos de SerenIA*

🙏 *Espirituales:*
/versiculo - Versículo personalizado del día
/oracion - Momento de oración guiada
/comunidad - Ver actividad de la comunidad

💙 *Bienestar:*
/animo - Evalúa tu estado emocional
/test - Evaluación rápida de bienestar
/recordatorio - Configurar notificaciones

🤖 *General:*
/start - Mensaje de bienvenida
/help - Esta ayuda

💬 *Conversación libre:*
Escríbeme cualquier pregunta o preocupación y te responderé con sabiduría bíblica y apoyo emocional.

🌐 *Aplicación completa:* [SerenIA App](https://serenia.app)
`,

  ERROR_GENERIC: '❌ Disculpa, hubo un error. ¿Podrías intentar de nuevo?',
  
  ERROR_API: '⚠️ Temporalmente no puedo conectarme con los servicios. Inténtalo en unos minutos.',

  TYPING: '⌨️ Estoy pensando en tu respuesta...',

  UNKNOWN_COMMAND: `
❓ No reconozco ese comando.

Usa /help para ver todos los comandos disponibles, o simplemente escríbeme libremente.

¿En qué puedo ayudarte? 🤗
`,

  MAINTENANCE: `
🔧 *Mantenimiento en progreso*

Algunas funciones pueden estar temporalmente limitadas. Disculpa las molestias.

Las funciones básicas de chat siguen disponibles. ¡Escríbeme! 💙
`
}

// Configuraciones de usuario
export interface TelegramUserConfig {
  telegramId: number
  userId?: string // ID en la base de datos de SerenIA
  language: string
  timezone: string
  reminders: {
    verse: { enabled: boolean; time: string }
    prayer: { enabled: boolean; time: string }
    mood: { enabled: boolean; frequency: 'daily' | 'weekly' }
    test: { enabled: boolean; frequency: 'weekly' | 'monthly' }
  }
  lastInteraction: string
  isActive: boolean
}

// Manejo de sesiones de conversación
export interface ConversationSession {
  chatId: number
  userId: number
  context: string // 'prayer', 'verse', 'mood', 'test', 'free'
  step: number
  data: any
  createdAt: string
  expiresAt: string
}

// Utilidades para recordatorios
export class ReminderUtils {
  static scheduleReminder(userConfig: TelegramUserConfig, type: 'verse' | 'prayer' | 'mood' | 'test') {
    // Esta función se integraría with n8n workflows para programar recordatorios
    console.log(`Scheduling ${type} reminder for user ${userConfig.telegramId}`)
  }

  static cancelReminder(telegramId: number, type: string) {
    // Cancelar recordatorio específico
    console.log(`Cancelling ${type} reminder for user ${telegramId}`)
  }

  static updateReminderTime(telegramId: number, type: string, newTime: string) {
    // Actualizar horario de recordatorio
    console.log(`Updating ${type} reminder time to ${newTime} for user ${telegramId}`)
  }
}