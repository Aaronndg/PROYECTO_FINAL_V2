import TelegramBot from 'node-telegram-bot-api'
import { telegramNotificationService, type UserNotificationPreferences } from './telegram-notification-service'
import { emotionalMonitoringService } from './emotional-monitoring'
import { createClient } from './supabase'

class TelegramBotService {
  private bot: TelegramBot | null = null
  private isInitialized = false

  constructor() {
    this.initialize()
  }

  private async initialize() {
    try {
      const token = process.env.TELEGRAM_BOT_TOKEN
      if (!token) {
        console.warn('⚠️ TELEGRAM_BOT_TOKEN no está configurado')
        return
      }

      this.bot = new TelegramBot(token, { 
        polling: true,
        request: {
          agentOptions: {
            keepAlive: true,
            family: 4,
          },
        },
      })

      await this.setupBotHandlers()
      this.isInitialized = true
      console.log('🤖 Telegram Bot inicializado y funcionando')

    } catch (error) {
      console.error('❌ Error inicializando Telegram Bot:', error)
    }
  }

  private async setupBotHandlers() {
    if (!this.bot) return

    // Comando /start
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id.toString()
      const userId = msg.from?.id.toString()
      
      if (!userId) return

      try {
        // Registrar usuario para notificaciones
        await telegramNotificationService.registerUser(userId, chatId)
        
        // Enviar mensaje de bienvenida
        await this.sendWelcomeMessage(chatId, userId)
      } catch (error) {
        console.error('Error en comando /start:', error)
      }
    })

    // Comando /checkin
    this.bot.onText(/\/checkin/, async (msg) => {
      const chatId = msg.chat.id.toString()
      const userId = msg.from?.id.toString()
      
      if (!userId) return

      await this.sendMoodCheckIn(chatId, userId)
    })

    // Comando /verse
    this.bot.onText(/\/verse/, async (msg) => {
      const chatId = msg.chat.id.toString()
      const userId = msg.from?.id.toString()
      
      if (!userId) return

      await this.sendDailyVerse(chatId, userId)
    })

    // Comando /activity
    this.bot.onText(/\/activity/, async (msg) => {
      const chatId = msg.chat.id.toString()
      const userId = msg.from?.id.toString()
      
      if (!userId) return

      await telegramNotificationService.sendActivity(chatId, 'general', userId)
    })

    // Comando /crisis
    this.bot.onText(/\/crisis/, async (msg) => {
      const chatId = msg.chat.id.toString()
      const userId = msg.from?.id.toString()
      
      if (!userId) return

      await this.sendCrisisHelp(chatId, userId)
    })

    // Comando /settings
    this.bot.onText(/\/settings/, async (msg) => {
      const chatId = msg.chat.id.toString()
      const userId = msg.from?.id.toString()
      
      if (!userId) return

      await this.sendSettingsMenu(chatId, userId)
    })

    // Manejar callbacks de botones inline
    this.bot.on('callback_query', async (callbackQuery) => {
      try {
        await telegramNotificationService.handleCallback(callbackQuery)
        await this.handleCustomCallbacks(callbackQuery)
      } catch (error) {
        console.error('Error manejando callback:', error)
      }
    })

    // Manejar mensajes de texto general
    this.bot.on('message', async (msg) => {
      if (msg.text && !msg.text.startsWith('/')) {
        await this.handleTextMessage(msg)
      }
    })

    // Manejar errores
    this.bot.on('error', (error) => {
      console.error('Error del bot de Telegram:', error)
    })

    // Manejar polling_error
    this.bot.on('polling_error', (error) => {
      console.error('Error de polling de Telegram:', error)
    })
  }

  private async sendWelcomeMessage(chatId: string, userId: string) {
    if (!this.bot) return

    const welcomeMessage = `
🌟 **¡Bienvenido a SerenIA!**

Soy tu asistente personal de bienestar emocional basado en principios cristianos. Estoy aquí para acompañarte en tu jornada de crecimiento y fe.

🔔 **Lo que puedo hacer por ti:**
• 📊 Monitorear tu bienestar emocional
• 📖 Compartir versículos personalizados
• 🙏 Guiarte en momentos de oración
• 💪 Sugerir actividades de bienestar
• 🚨 Detectar momentos de crisis y ofrecer ayuda
• 💬 Conversar cuando necesites apoyo

⏰ **Notificaciones programadas:**
• 🌅 Buenos días: 8:00 AM
• ☀️ Check-in: 2:00 PM
• 🌙 Reflexión: 8:00 PM

📱 **Comandos disponibles:**
/checkin - Estado emocional rápido
/verse - Versículo del día
/activity - Actividad de bienestar
/crisis - Ayuda inmediata
/settings - Configurar notificaciones

¡Empecemos juntos este hermoso camino de fe y bienestar! 🙏💙
`

    try {
      await this.bot.sendMessage(chatId, welcomeMessage, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '💭 Mi primer check-in', callback_data: 'first_checkin' },
              { text: '📖 Versículo de hoy', callback_data: 'daily_verse' }
            ],
            [
              { text: '🎯 Ver actividades', callback_data: 'view_activities' },
              { text: '⚙️ Configurar', callback_data: 'settings_menu' }
            ]
          ]
        }
      })
    } catch (error) {
      console.error('Error enviando mensaje de bienvenida:', error)
    }
  }

  private async sendMoodCheckIn(chatId: string, userId: string) {
    if (!this.bot) return

    const message = `
💭 **Check-in Emocional Rápido**

¿Cómo te sientes en este momento? Usa la escala para expresar tu estado actual:

1-2: Muy mal 😭
3-4: Mal 😔  
5-6: Regular 😐
7-8: Bien 🙂
9-10: Excelente 😊

Selecciona tu estado y después puedes contarme más detalles:
`

    try {
      await this.bot.sendMessage(chatId, message, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '😭 1-2 Muy mal', callback_data: 'mood_1' },
              { text: '😔 3-4 Mal', callback_data: 'mood_3' }
            ],
            [
              { text: '😐 5-6 Regular', callback_data: 'mood_5' },
              { text: '🙂 7-8 Bien', callback_data: 'mood_7' }
            ],
            [
              { text: '😊 9-10 Excelente', callback_data: 'mood_9' }
            ],
            [
              { text: '💬 Quiero contarte más detalles', callback_data: 'detailed_sharing' }
            ]
          ]
        }
      })
    } catch (error) {
      console.error('Error enviando mood check-in:', error)
    }
  }

  private async sendDailyVerse(chatId: string, userId: string) {
    if (!this.bot) return

    const userProfile = emotionalMonitoringService.getUserProfile(userId)
    
    // Seleccionar versículo basado en el estado emocional
    let verseData = this.getDefaultVerse()
    
    if (userProfile) {
      if (userProfile.recent_trend === 'improving') {
        verseData = this.getCelebrationVerse()
      } else if (userProfile.recent_trend === 'declining' || userProfile.crisis_risk_level === 'high') {
        verseData = this.getComfortVerse()
      } else if (userProfile.common_emotions.includes('ansiedad')) {
        verseData = this.getPeaceVerse()
      }
    }

    const message = `
📖 **${verseData.title}**

"${verseData.text}"

*${verseData.reference}*

💙 ${verseData.reflection}
`

    try {
      await this.bot.sendMessage(chatId, message, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🙏 Orar con este versículo', callback_data: 'pray_verse' },
              { text: '📝 Reflexionar', callback_data: 'reflect_verse' }
            ],
            [
              { text: '📖 Otro versículo', callback_data: 'another_verse' },
              { text: '💬 Hablar de esto', callback_data: 'discuss_verse' }
            ]
          ]
        }
      })
    } catch (error) {
      console.error('Error enviando versículo:', error)
    }
  }

  private async sendCrisisHelp(chatId: string, userId: string) {
    if (!this.bot) return

    const message = `
🚨 **AYUDA INMEDIATA DISPONIBLE**

Si estás en crisis o tienes pensamientos de hacerte daño, por favor busca ayuda AHORA:

🆘 **Líneas de Crisis 24/7:**
• Crisis Nacional: 988
• Emergencias: 911
• SAPTEL: 55 5259 8121

💻 **Chat de Crisis Online:**
• suicidepreventionlifeline.org
• Crisis Text Line: Texto HOME al 741741

🙏 **Verdades importantes:**
• Tu vida tiene valor infinito
• Dios te ama profundamente
• Hay esperanza, incluso en la oscuridad
• No tienes que enfrentar esto solo

💙 **También estoy aquí para ti**
¿Te gustaría que oremos juntos o hablemos ahora?
`

    try {
      await this.bot.sendMessage(chatId, message, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🆘 Llamar Crisis 988', url: 'tel:988' },
              { text: '🚨 Emergencia 911', url: 'tel:911' }
            ],
            [
              { text: '💬 Chat Crisis Online', url: 'https://suicidepreventionlifeline.org' }
            ],
            [
              { text: '🙏 Orar juntos ahora', callback_data: 'crisis_prayer' },
              { text: '💭 Seguir hablando', callback_data: 'crisis_talk' }
            ]
          ]
        }
      })
    } catch (error) {
      console.error('Error enviando ayuda de crisis:', error)
    }
  }

  private async sendSettingsMenu(chatId: string, userId: string) {
    if (!this.bot) return

    const message = `
⚙️ **Configuración de SerenIA**

Personaliza tu experiencia con SerenIA:

🔔 **Notificaciones actuales:**
• 🌅 Buenos días: 8:00 AM
• ☀️ Check-in: 2:00 PM
• 🌙 Reflexión: 8:00 PM

¿Qué te gustaría ajustar?
`

    try {
      await this.bot.sendMessage(chatId, message, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '⏰ Cambiar horarios', callback_data: 'change_times' },
              { text: '🔕 Pausar notificaciones', callback_data: 'pause_notifications' }
            ],
            [
              { text: '📍 Zona horaria', callback_data: 'change_timezone' },
              { text: '🎯 Tipos de mensajes', callback_data: 'message_types' }
            ],
            [
              { text: '💾 Guardar configuración', callback_data: 'save_settings' }
            ]
          ]
        }
      })
    } catch (error) {
      console.error('Error enviando menú de configuración:', error)
    }
  }

  private async handleCustomCallbacks(callbackQuery: any) {
    if (!this.bot) return

    const chatId = callbackQuery.message.chat.id.toString()
    const data = callbackQuery.data
    const userId = callbackQuery.from.id.toString()

    try {
      switch (data) {
        case 'first_checkin':
          await this.sendMoodCheckIn(chatId, userId)
          break

        case 'view_activities':
          await this.sendActivitiesMenu(chatId, userId)
          break

        case 'settings_menu':
          await this.sendSettingsMenu(chatId, userId)
          break

        case 'another_verse':
          await this.sendDailyVerse(chatId, userId)
          break

        // Manejar respuestas de mood
        case 'mood_1':
        case 'mood_3':
        case 'mood_5':
        case 'mood_7':
        case 'mood_9':
          await this.handleMoodResponse(chatId, userId, data)
          break

        default:
          // Otros callbacks son manejados por telegramNotificationService
          break
      }
    } catch (error) {
      console.error('Error manejando callback personalizado:', error)
    }
  }

  private async handleMoodResponse(chatId: string, userId: string, moodData: string) {
    if (!this.bot) return

    const moodScore = parseInt(moodData.replace('mood_', ''))
    
    // Registrar el estado de ánimo
    await emotionalMonitoringService.analyzeEmotionalState(
      userId,
      `Mood check-in via Telegram: ${moodScore}`,
      'telegram',
      moodScore
    )

    let responseMessage = ''
    let suggestions: any[] = []

    if (moodScore <= 2) {
      responseMessage = `💙 Veo que estás pasando por un momento muy difícil. Quiero que sepas que no estás solo y que Dios está contigo.

"Cercano está Jehová a los quebrantados de corazón; Y salva a los contritos de espíritu." - Salmos 34:18

¿Te gustaría que hablemos más o que te ayude de alguna manera específica?`
      
      suggestions = [
        [
          { text: '🆘 Necesito ayuda inmediata', callback_data: 'crisis_help' },
          { text: '🙏 Orar juntos', callback_data: 'crisis_prayer' }
        ],
        [
          { text: '💭 Quiero contarte más', callback_data: 'detailed_sharing' },
          { text: '💨 Ejercicio de respiración', callback_data: 'breathing_exercise' }
        ]
      ]
    } else if (moodScore <= 4) {
      responseMessage = `💙 Entiendo que no es tu mejor momento. Está bien sentirse así a veces. 

"Por nada estéis afanosos... y la paz de Dios guardará vuestros corazones" - Filipenses 4:6-7

¿Hay algo específico que te gustaría hacer para sentirte un poco mejor?`
      
      suggestions = [
        [
          { text: '💨 Respiración guiada', callback_data: 'breathing_exercise' },
          { text: '📖 Versículo de aliento', callback_data: 'comfort_verse' }
        ],
        [
          { text: '💭 Hablar de lo que siento', callback_data: 'detailed_sharing' },
          { text: '🎯 Actividad sencilla', callback_data: 'simple_activity' }
        ]
      ]
    } else if (moodScore <= 6) {
      responseMessage = `😊 Gracias por compartir cómo te sientes. Es normal tener días regulares.

"Este es el día que hizo Jehová; nos gozaremos y alegraremos en él." - Salmos 118:24

¿Te gustaría hacer algo que pueda mejorar tu día?`
      
      suggestions = [
        [
          { text: '📖 Versículo inspirador', callback_data: 'daily_verse' },
          { text: '🎯 Actividad motivante', callback_data: 'motivating_activity' }
        ],
        [
          { text: '🙏 Momento de gratitud', callback_data: 'gratitude_exercise' },
          { text: '💭 Reflexión personal', callback_data: 'personal_reflection' }
        ]
      ]
    } else if (moodScore <= 8) {
      responseMessage = `😊 ¡Me alegra saber que te sientes bien! Es hermoso ver tu ánimo positivo.

"Regocijaos en el Señor siempre. Otra vez digo: ¡Regocijaos!" - Filipenses 4:4

¿Te gustaría aprovechar este buen momento para algo especial?`
      
      suggestions = [
        [
          { text: '🙏 Momento de gratitud', callback_data: 'gratitude_exercise' },
          { text: '📖 Estudio bíblico', callback_data: 'bible_study' }
        ],
        [
          { text: '💪 Actividad energizante', callback_data: 'energizing_activity' },
          { text: '💭 Planear el día', callback_data: 'day_planning' }
        ]
      ]
    } else {
      responseMessage = `🎉 ¡Qué hermoso verte tan radiante! Tu gozo es contagioso y refleja la bondad de Dios.

"Gozaos con los que se gozan" - Romanos 12:15

¡Celebremos juntos este momento tan especial!`
      
      suggestions = [
        [
          { text: '🎉 Celebrar con gratitud', callback_data: 'celebration_gratitude' },
          { text: '📖 Versículo de alabanza', callback_data: 'praise_verse' }
        ],
        [
          { text: '💪 Compartir el gozo', callback_data: 'share_joy' },
          { text: '🎯 Aprovechar la energía', callback_data: 'productive_activity' }
        ]
      ]
    }

    try {
      await this.bot.sendMessage(chatId, responseMessage, {
        reply_markup: {
          inline_keyboard: suggestions
        }
      })
    } catch (error) {
      console.error('Error enviando respuesta de mood:', error)
    }
  }

  private async sendActivitiesMenu(chatId: string, userId: string) {
    if (!this.bot) return

    const message = `
🎯 **Actividades de Bienestar**

Selecciona una actividad que resuene contigo en este momento:

💭 **Reflexión y Oración**
🙏 Momentos de oración guiada
📖 Estudio bíblico interactivo
🌟 Práctica de gratitud

🧘 **Bienestar Emocional**
💨 Ejercicios de respiración
🎵 Meditación con música
🌅 Reflexión matutina

💪 **Crecimiento Personal**
📝 Diario de emociones
🎯 Establecer metas
💙 Autocompasión cristiana

¿Cuál te llama la atención hoy?
`

    try {
      await this.bot.sendMessage(chatId, message, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🙏 Oración guiada', callback_data: 'guided_prayer' },
              { text: '📖 Estudio bíblico', callback_data: 'bible_study' }
            ],
            [
              { text: '💨 Respiración', callback_data: 'breathing_exercise' },
              { text: '🌟 Gratitud', callback_data: 'gratitude_exercise' }
            ],
            [
              { text: '📝 Diario emocional', callback_data: 'emotional_journal' },
              { text: '🎯 Metas personales', callback_data: 'goal_setting' }
            ],
            [
              { text: '🔄 Actividad aleatoria', callback_data: 'random_activity' }
            ]
          ]
        }
      })
    } catch (error) {
      console.error('Error enviando menú de actividades:', error)
    }
  }

  private async handleTextMessage(msg: any) {
    if (!this.bot) return

    const chatId = msg.chat.id.toString()
    const userId = msg.from?.id.toString()
    const text = msg.text

    if (!userId || !text) return

    try {
      // Registrar el mensaje en el monitoreo emocional
      await emotionalMonitoringService.analyzeEmotionalState(
        userId,
        text,
        'telegram',
        5 // Neutral por defecto
      )

      // Respuesta empática basada en el contenido
      const response = await this.generateEmpatheticResponse(text, userId)
      
      await this.bot.sendMessage(chatId, response, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '💭 ¿Cómo te sientes ahora?', callback_data: 'mood_checkin' },
              { text: '📖 Versículo de aliento', callback_data: 'daily_verse' }
            ],
            [
              { text: '🎯 Actividad de bienestar', callback_data: 'view_activities' }
            ]
          ]
        }
      })

    } catch (error) {
      console.error('Error manejando mensaje de texto:', error)
    }
  }

  private async generateEmpatheticResponse(text: string, userId: string): Promise<string> {
    // Análisis básico del contenido emocional
    const lowerText = text.toLowerCase()
    
    if (lowerText.includes('triste') || lowerText.includes('deprim') || lowerText.includes('llorar')) {
      return `💙 Puedo sentir la tristeza en tus palabras. Es valiente de tu parte compartir cómo te sientes. 

"Jehová está cerca de los quebrantados de corazón; y salva a los contritos de espíritu." - Salmos 34:18

No estás solo en esto. ¿Te gustaría que hablemos más o que te ayude de alguna manera específica?`
    }
    
    if (lowerText.includes('ansio') || lowerText.includes('nervios') || lowerText.includes('preocup')) {
      return `🤲 Entiendo que la ansiedad puede ser abrumadora. Respira conmigo por un momento.

"Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias." - Filipenses 4:6

¿Te gustaría que hagamos un ejercicio de respiración juntos?`
    }
    
    if (lowerText.includes('feliz') || lowerText.includes('alegr') || lowerText.includes('bien')) {
      return `😊 ¡Qué hermoso es escuchar tu alegría! El gozo es un regalo precioso de Dios.

"Este es el día que hizo Jehová; nos gozaremos y alegraremos en él." - Salmos 118:24

¿Te gustaría compartir qué te tiene tan contento/a o hacer algo para celebrar este momento?`
    }
    
    if (lowerText.includes('enoja') || lowerText.includes('frustrar') || lowerText.includes('molest')) {
      return `💪 Es natural sentir frustración a veces. Reconocer estas emociones es el primer paso para manejarlas sabiamente.

"Airaos, pero no pequéis; no se ponga el sol sobre vuestro enojo." - Efesios 4:26

¿Te gustaría que conversemos sobre lo que te está frustrando o prefieres hacer algo para calmarte?`
    }
    
    // Respuesta general empática
    return `💙 Gracias por compartir conmigo. Valoro tu confianza al abrirte.

"Echad toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros." - 1 Pedro 5:7

Estoy aquí para acompañarte. ¿Hay algo específico con lo que te gustaría que te ayude?`
  }

  // Métodos para versículos específicos
  private getDefaultVerse() {
    return {
      title: 'Versículo de Paz',
      text: 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.',
      reference: 'Filipenses 4:6-7',
      reflection: 'Que este versículo traiga paz a tu corazón hoy.'
    }
  }

  private getCelebrationVerse() {
    return {
      title: 'Versículo de Celebración',
      text: 'Regocijaos en el Señor siempre. Otra vez digo: ¡Regocijaos!',
      reference: 'Filipenses 4:4',
      reflection: 'He notado tu progreso positivo. ¡Dios está obrando en tu vida!'
    }
  }

  private getComfortVerse() {
    return {
      title: 'Versículo de Consuelo',
      text: 'Cercano está Jehová a los quebrantados de corazón; Y salva a los contritos de espíritu.',
      reference: 'Salmos 34:18',
      reflection: 'En los momentos difíciles, recuerda que Dios está muy cerca de ti.'
    }
  }

  private getPeaceVerse() {
    return {
      title: 'Versículo de Calma',
      text: 'La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo.',
      reference: 'Juan 14:27',
      reflection: 'Que la paz de Cristo calme cualquier ansiedad en tu corazón.'
    }
  }

  // Método para verificar si el bot está funcionando
  isRunning(): boolean {
    return this.isInitialized && this.bot !== null
  }

  // Método para obtener información del bot
  async getBotInfo() {
    if (!this.bot) return null
    
    try {
      return await this.bot.getMe()
    } catch (error) {
      console.error('Error obteniendo información del bot:', error)
      return null
    }
  }
}

export const telegramBotService = new TelegramBotService()
export { TelegramBotService }