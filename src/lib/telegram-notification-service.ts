import TelegramBot from 'node-telegram-bot-api'
import { emotionalMonitoringService } from './emotional-monitoring'
import { createClient } from './supabase'

interface UserNotificationPreferences {
  user_id: string
  telegram_chat_id: string
  morning_time: string // "08:00"
  afternoon_time: string // "14:00"
  evening_time: string // "20:00"
  timezone: string
  enabled: boolean
  notification_types: string[] // ['check_in', 'reminders', 'verses', 'activities']
}

interface ScheduledActivity {
  id: string
  title: string
  description: string
  type: 'reflection' | 'gratitude' | 'prayer' | 'breathing' | 'verse_study'
  duration_minutes: number
  instructions: string[]
}

class TelegramNotificationService {
  private bot: TelegramBot
  private notificationIntervals: Map<string, NodeJS.Timeout> = new Map()
  
  // Actividades programadas para enviar a los usuarios
  private activities: ScheduledActivity[] = [
    {
      id: 'gratitude_morning',
      title: '🌅 Práctica de Gratitud Matutina',
      description: 'Comienza tu día reconociendo las bendiciones de Dios',
      type: 'gratitude',
      duration_minutes: 5,
      instructions: [
        'Toma 3 respiraciones profundas',
        'Menciona 3 cosas por las que agradeces a Dios hoy',
        'Ora brevemente por el día que comienza',
        'Sonríe y confía en que Dios tiene planes buenos para ti'
      ]
    },
    {
      id: 'breathing_stress',
      title: '💨 Respiración para la Calma',
      description: 'Técnica bíblica de respiración para encontrar paz',
      type: 'breathing',
      duration_minutes: 3,
      instructions: [
        'Inhala por 4 segundos pensando "Dios está"',
        'Mantén por 4 segundos pensando "conmigo"',
        'Exhala por 6 segundos pensando "me da paz"',
        'Repite 5 veces',
        'Termina con "Gracias Señor por tu paz"'
      ]
    },
    {
      id: 'reflection_evening',
      title: '🌙 Reflexión Nocturna',
      description: 'Evalúa tu día con perspectiva espiritual',
      type: 'reflection',
      duration_minutes: 10,
      instructions: [
        '¿Cómo viste a Dios obrar hoy?',
        '¿Qué momentos te trajeron gozo?',
        '¿Hay algo que quieras entregar a Dios?',
        'Agradece por las lecciones del día',
        'Pide bendición para mañana'
      ]
    },
    {
      id: 'prayer_focus',
      title: '🙏 Momento de Oración Enfocada',
      description: 'Tiempo de conexión íntima con Dios',
      type: 'prayer',
      duration_minutes: 7,
      instructions: [
        'Busca un lugar tranquilo',
        'Comienza agradeciendo a Dios',
        'Comparte tus preocupaciones',
        'Pide por otros (familia, amigos)',
        'Escucha en silencio por 2 minutos',
        'Termina con el Padre Nuestro'
      ]
    },
    {
      id: 'verse_meditation',
      title: '📖 Meditación en la Palabra',
      description: 'Profundiza en un versículo específico',
      type: 'verse_study',
      duration_minutes: 8,
      instructions: [
        'Lee el versículo 3 veces despacio',
        '¿Qué palabra o frase te llama la atención?',
        '¿Cómo se aplica a tu vida hoy?',
        '¿Qué te está enseñando Dios?',
        'Ora pidiendo que vivas esta verdad'
      ]
    }
  ]

  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN
    if (!token) {
      console.warn('⚠️ TELEGRAM_BOT_TOKEN no configurado')
      return
    }

    this.bot = new TelegramBot(token, { polling: false })
    this.initializeBot()
  }

  private initializeBot() {
    // Configurar comandos del bot
    this.bot.setMyCommands([
      { command: 'start', description: 'Iniciar SerenIA Bot' },
      { command: 'checkin', description: 'Check-in emocional rápido' },
      { command: 'verse', description: 'Recibir versículo del día' },
      { command: 'activity', description: 'Actividad de bienestar' },
      { command: 'crisis', description: 'Recursos de ayuda inmediata' },
      { command: 'settings', description: 'Configurar notificaciones' }
    ])

    console.log('🤖 Telegram Bot inicializado correctamente')
  }

  // Registrar usuario para notificaciones
  async registerUser(userId: string, chatId: string, preferences: Partial<UserNotificationPreferences> = {}) {
    const defaultPreferences: UserNotificationPreferences = {
      user_id: userId,
      telegram_chat_id: chatId,
      morning_time: '08:00',
      afternoon_time: '14:00',
      evening_time: '20:00',
      timezone: 'America/Mexico_City',
      enabled: true,
      notification_types: ['check_in', 'reminders', 'verses'],
      ...preferences
    }

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('telegram_users')
        .upsert(defaultPreferences)

      if (error) throw error

      // Iniciar notificaciones programadas
      await this.setupUserNotifications(defaultPreferences)
      
      console.log(`✅ Usuario ${userId} registrado para notificaciones de Telegram`)
      
      // Enviar mensaje de bienvenida
      await this.sendWelcomeMessage(chatId, userId)
      
    } catch (error) {
      console.error('Error registrando usuario de Telegram:', error)
    }
  }

  // Configurar notificaciones programadas para un usuario
  private async setupUserNotifications(preferences: UserNotificationPreferences) {
    const { user_id, telegram_chat_id, morning_time, afternoon_time, evening_time } = preferences

    // Limpiar notificaciones existentes
    const existingInterval = this.notificationIntervals.get(user_id)
    if (existingInterval) {
      clearInterval(existingInterval)
    }

    // Configurar nuevas notificaciones cada hora
    const interval = setInterval(async () => {
      await this.checkAndSendScheduledNotifications(preferences)
    }, 60 * 60 * 1000) // Cada hora

    this.notificationIntervals.set(user_id, interval)
  }

  // Verificar y enviar notificaciones programadas
  private async checkAndSendScheduledNotifications(preferences: UserNotificationPreferences) {
    const now = new Date()
    const currentTime = now.toTimeString().slice(0, 5) // "HH:MM"
    const { user_id, telegram_chat_id, morning_time, afternoon_time, evening_time } = preferences

    // Obtener perfil emocional del usuario
    const userProfile = emotionalMonitoringService.getUserProfile(user_id)
    const notifications = emotionalMonitoringService.generateTelegramNotifications(user_id)

    try {
      if (currentTime === morning_time) {
        await this.sendNotification(telegram_chat_id, notifications.morning, 'morning', user_id)
      } else if (currentTime === afternoon_time) {
        await this.sendNotification(telegram_chat_id, notifications.afternoon, 'afternoon', user_id)
      } else if (currentTime === evening_time) {
        await this.sendNotification(telegram_chat_id, notifications.evening, 'evening', user_id)
      }

      // Notificaciones de emergencia si hay riesgo de crisis
      if (userProfile?.crisis_risk_level === 'critical' && notifications.emergency) {
        await this.sendCrisisNotification(telegram_chat_id, notifications.emergency)
      }

    } catch (error) {
      console.error(`Error enviando notificación a ${user_id}:`, error)
    }
  }

  // Enviar notificación personalizada
  private async sendNotification(chatId: string, message: string, type: string, userId: string) {
    try {
      const keyboard = this.getContextualKeyboard(type, userId)
      
      await this.bot.sendMessage(chatId, message, {
        reply_markup: {
          inline_keyboard: keyboard
        }
      })

      console.log(`📱 Notificación ${type} enviada a ${userId}`)
    } catch (error) {
      console.error('Error enviando notificación:', error)
    }
  }

  // Enviar notificación de crisis
  private async sendCrisisNotification(chatId: string, message: string) {
    try {
      await this.bot.sendMessage(chatId, message, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🆘 Línea de Crisis', url: 'tel:988' },
              { text: '🚨 Emergencias', url: 'tel:911' }
            ],
            [
              { text: '💬 Chat de Crisis', url: 'https://suicidepreventionlifeline.org' }
            ],
            [
              { text: '🙏 Hablar con SerenIA', callback_data: 'crisis_chat' }
            ]
          ]
        }
      })
    } catch (error) {
      console.error('Error enviando notificación de crisis:', error)
    }
  }

  // Obtener teclado contextual según el momento del día
  private getContextualKeyboard(type: string, userId: string): any[][] {
    const baseKeyboard = [
      [
        { text: '💭 ¿Cómo me siento?', callback_data: 'mood_checkin' },
        { text: '📖 Versículo', callback_data: 'daily_verse' }
      ]
    ]

    switch (type) {
      case 'morning':
        return [
          [
            { text: '🌅 Actividad Matutina', callback_data: 'morning_activity' },
            { text: '🎯 Metas del Día', callback_data: 'daily_goals' }
          ],
          ...baseKeyboard
        ]

      case 'afternoon':
        return [
          [
            { text: '🔄 Check-in Rápido', callback_data: 'quick_checkin' },
            { text: '💨 Respiración', callback_data: 'breathing_exercise' }
          ],
          ...baseKeyboard
        ]

      case 'evening':
        return [
          [
            { text: '🌙 Reflexión', callback_data: 'evening_reflection' },
            { text: '🙏 Oración', callback_data: 'prayer_time' }
          ],
          ...baseKeyboard
        ]

      default:
        return baseKeyboard
    }
  }

  // Enviar mensaje de bienvenida
  private async sendWelcomeMessage(chatId: string, userId: string) {
    const welcomeMessage = `
🌟 ¡Bienvenido a SerenIA Bot!

Soy tu asistente de bienestar emocional que te acompañará en tu jornada de fe y crecimiento personal.

🔔 **Notificaciones configuradas:**
• 🌅 Buenos días: 8:00 AM
• ☀️ Check-in: 2:00 PM  
• 🌙 Reflexión: 8:00 PM

📱 **Comandos disponibles:**
• /checkin - Estado emocional rápido
• /verse - Versículo del día
• /activity - Actividad de bienestar
• /settings - Configurar horarios

¡Empecemos este hermoso camino juntos! 🙏💙
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
              { text: '⚙️ Configurar horarios', callback_data: 'configure_times' }
            ]
          ]
        }
      })
    } catch (error) {
      console.error('Error enviando mensaje de bienvenida:', error)
    }
  }

  // Enviar actividad específica
  async sendActivity(chatId: string, activityType: string, userId: string) {
    const userProfile = emotionalMonitoringService.getUserProfile(userId)
    
    // Seleccionar actividad apropiada según el estado emocional
    let selectedActivity: ScheduledActivity
    
    if (userProfile?.crisis_risk_level === 'high' || userProfile?.crisis_risk_level === 'critical') {
      selectedActivity = this.activities.find(a => a.type === 'breathing') || this.activities[1]
    } else if (userProfile?.recent_trend === 'declining') {
      selectedActivity = this.activities.find(a => a.type === 'prayer') || this.activities[3]
    } else if (userProfile?.recent_trend === 'improving') {
      selectedActivity = this.activities.find(a => a.type === 'gratitude') || this.activities[0]
    } else {
      // Actividad según la hora del día
      const hour = new Date().getHours()
      if (hour < 12) {
        selectedActivity = this.activities[0] // Gratitud matutina
      } else if (hour < 18) {
        selectedActivity = this.activities[1] // Respiración
      } else {
        selectedActivity = this.activities[2] // Reflexión nocturna
      }
    }

    const activityMessage = `
🎯 **${selectedActivity.title}**

${selectedActivity.description}

⏱️ *Tiempo estimado: ${selectedActivity.duration_minutes} minutos*

📝 **Instrucciones:**
${selectedActivity.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n')}

💡 *Recuerda: No hay prisa. Ve a tu propio ritmo y permite que Dios obre en tu corazón.*
`

    try {
      await this.bot.sendMessage(chatId, activityMessage, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '✅ Completé la actividad', callback_data: `activity_completed_${selectedActivity.id}` },
              { text: '🔄 Otra actividad', callback_data: 'new_activity' }
            ],
            [
              { text: '💬 Comentar mi experiencia', callback_data: 'share_experience' }
            ]
          ]
        }
      })
    } catch (error) {
      console.error('Error enviando actividad:', error)
    }
  }

  // Manejar callbacks de botones
  async handleCallback(callbackQuery: any) {
    const chatId = callbackQuery.message.chat.id
    const data = callbackQuery.data
    const userId = callbackQuery.from.id.toString()

    try {
      switch (data) {
        case 'mood_checkin':
          await this.sendMoodCheckIn(chatId, userId)
          break
        case 'daily_verse':
          await this.sendDailyVerse(chatId, userId)
          break
        case 'morning_activity':
        case 'breathing_exercise':
        case 'evening_reflection':
        case 'prayer_time':
          await this.sendActivity(chatId, data, userId)
          break
        case 'crisis_chat':
          await this.sendCrisisSupport(chatId, userId)
          break
        default:
          if (data.startsWith('activity_completed_')) {
            await this.handleActivityCompletion(chatId, userId, data)
          }
      }

      // Responder al callback
      await this.bot.answerCallbackQuery(callbackQuery.id)
    } catch (error) {
      console.error('Error manejando callback:', error)
    }
  }

  // Enviar check-in de estado de ánimo
  private async sendMoodCheckIn(chatId: string, userId: string) {
    const message = `
💭 **Check-in Emocional**

¿Cómo te sientes en este momento? 

Usa la escala para expresar tu estado actual:
`

    try {
      await this.bot.sendMessage(chatId, message, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '😭 1-2', callback_data: 'mood_1' },
              { text: '😔 3-4', callback_data: 'mood_3' },
              { text: '😐 5-6', callback_data: 'mood_5' }
            ],
            [
              { text: '🙂 7-8', callback_data: 'mood_7' },
              { text: '😊 9-10', callback_data: 'mood_9' }
            ],
            [
              { text: '💬 Quiero contarte más', callback_data: 'detailed_sharing' }
            ]
          ]
        }
      })
    } catch (error) {
      console.error('Error enviando mood check-in:', error)
    }
  }

  // Enviar versículo diario personalizado
  private async sendDailyVerse(chatId: string, userId: string) {
    const userProfile = emotionalMonitoringService.getUserProfile(userId)
    
    // Seleccionar versículo según el estado emocional
    let verseMessage = `
📖 **Versículo de Hoy**

"Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús."

*Filipenses 4:6-7*

💙 Que este versículo traiga paz a tu corazón hoy.
`

    if (userProfile?.recent_trend === 'improving') {
      verseMessage = `
📖 **Versículo de Celebración**

"Regocijaos en el Señor siempre. Otra vez digo: ¡Regocijaos!"

*Filipenses 4:4*

🎉 He notado tu progreso positivo. ¡Dios está obrando en tu vida!
`
    } else if (userProfile?.recent_trend === 'declining') {
      verseMessage = `
📖 **Versículo de Fortaleza**

"Cercano está Jehová a los quebrantados de corazón; Y salva a los contritos de espíritu."

*Salmos 34:18*

💙 En los momentos difíciles, recuerda que Dios está muy cerca de ti.
`
    }

    try {
      await this.bot.sendMessage(chatId, verseMessage, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '🙏 Orar con este versículo', callback_data: 'pray_verse' },
              { text: '📝 Reflexionar', callback_data: 'reflect_verse' }
            ],
            [
              { text: '📖 Más versículos', callback_data: 'more_verses' },
              { text: '💬 Hablar de esto', callback_data: 'discuss_verse' }
            ]
          ]
        }
      })
    } catch (error) {
      console.error('Error enviando versículo diario:', error)
    }
  }

  // Enviar apoyo de crisis
  private async sendCrisisSupport(chatId: string, userId: string) {
    const message = `
💙 **Estoy aquí para ti**

Veo que estás pasando por un momento muy difícil. Quiero que sepas que:

✨ Tu vida tiene valor inmenso
✨ Dios te ama profundamente  
✨ Hay esperanza, incluso en la oscuridad
✨ No tienes que enfrentar esto solo

🆘 **Ayuda inmediata disponible:**
• Crisis: 988
• Emergencias: 911
• Chat crisis: suicidepreventionlifeline.org

¿Te gustaría que oremos juntos o que te conecte con recursos adicionales?
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
              { text: '🙏 Orar juntos', callback_data: 'crisis_prayer' },
              { text: '💬 Seguir hablando', callback_data: 'crisis_talk' }
            ],
            [
              { text: '📞 Recursos profesionales', callback_data: 'professional_help' }
            ]
          ]
        }
      })
    } catch (error) {
      console.error('Error enviando apoyo de crisis:', error)
    }
  }

  // Manejar finalización de actividad
  private async handleActivityCompletion(chatId: string, userId: string, callbackData: string) {
    const activityId = callbackData.replace('activity_completed_', '')
    
    // Registrar la actividad completada en el perfil emocional
    await emotionalMonitoringService.analyzeEmotionalState(
      userId,
      `Completé la actividad: ${activityId}`,
      'chat',
      7 // Asumir mejora por completar actividad
    )

    const message = `
🎉 **¡Excelente trabajo!**

Has completado tu actividad de bienestar. Cada pequeño paso cuenta en tu jornada de crecimiento.

💫 *"Siendo perseverantes en la oración"* - Romanos 12:12

¿Cómo te sientes después de esta práctica?
`

    try {
      await this.bot.sendMessage(chatId, message, {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '😊 Me siento mejor', callback_data: 'feeling_better' },
              { text: '😐 Igual que antes', callback_data: 'feeling_same' }
            ],
            [
              { text: '💭 Quiero compartir', callback_data: 'share_experience' },
              { text: '🔄 Otra actividad', callback_data: 'new_activity' }
            ]
          ]
        }
      })
    } catch (error) {
      console.error('Error manejando finalización de actividad:', error)
    }
  }
}

export const telegramNotificationService = new TelegramNotificationService()
export type { UserNotificationPreferences, ScheduledActivity }