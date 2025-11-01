import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { emotionalMonitoringService } from '@/lib/emotional-monitoring'

export async function POST(request: NextRequest) {
  try {
    // Verificar autorización para cron jobs
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.TELEGRAM_CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const token = process.env.TELEGRAM_BOT_TOKEN
    
    if (!token) {
      return NextResponse.json(
        { error: 'TELEGRAM_BOT_TOKEN no configurado' },
        { status: 400 }
      )
    }

    const supabase = createClient()
    const currentTime = new Date().toTimeString().slice(0, 5) // "HH:MM"
    
    // Obtener usuarios que necesitan notificaciones en esta hora
    const { data: users, error } = await supabase
      .from('telegram_users')
      .select('user_id, telegram_chat_id, first_name, morning_time, afternoon_time, evening_time')
      .eq('notifications_enabled', true)
      .gte('last_interaction', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Activos en última semana

    if (error) {
      console.error('Error obteniendo usuarios de Telegram:', error)
      return NextResponse.json(
        { error: 'Error consultando usuarios' },
        { status: 500 }
      )
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ 
        message: 'No hay usuarios para notificar en este momento',
        current_time: currentTime,
        users_count: 0
      })
    }

    const notifications = []
    let sentCount = 0

    for (const user of users) {
      let notificationType = ''
      let shouldSend = false

      // Determinar tipo de notificación según la hora
      if (user.morning_time === currentTime) {
        notificationType = 'morning'
        shouldSend = true
      } else if (user.afternoon_time === currentTime) {
        notificationType = 'afternoon'
        shouldSend = true
      } else if (user.evening_time === currentTime) {
        notificationType = 'evening'
        shouldSend = true
      }

      if (shouldSend) {
        try {
          // Generar mensaje personalizado basado en el perfil emocional
          const telegramNotifications = emotionalMonitoringService.generateTelegramNotifications(user.user_id)
          let message = ''
          
          switch (notificationType) {
            case 'morning':
              message = telegramNotifications.morning
              break
            case 'afternoon':
              message = telegramNotifications.afternoon
              break
            case 'evening':
              message = telegramNotifications.evening
              break
          }

          // Enviar notificación
          const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: user.telegram_chat_id,
              text: message,
              parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: getContextualKeyboard(notificationType)
              }
            }),
          })

          const result = await response.json()

          if (result.ok) {
            sentCount++
            
            // Registrar notificación enviada
            await supabase
              .from('telegram_notifications')
              .insert({
                user_id: user.user_id,
                notification_type: notificationType,
                message_content: message,
                delivered: true,
                message_id: result.result.message_id,
                chat_id: user.telegram_chat_id
              })

            notifications.push({
              user_id: user.user_id,
              type: notificationType,
              status: 'sent',
              message_id: result.result.message_id
            })
          } else {
            notifications.push({
              user_id: user.user_id,
              type: notificationType,
              status: 'failed',
              error: result.description
            })
          }

        } catch (error) {
          console.error(`Error enviando notificación a ${user.user_id}:`, error)
          notifications.push({
            user_id: user.user_id,
            type: notificationType,
            status: 'error',
            error: error instanceof Error ? error.message : 'Error desconocido'
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Proceso de notificaciones completado`,
      summary: {
        current_time: currentTime,
        total_users: users.length,
        notifications_sent: sentCount,
        notifications_failed: notifications.filter(n => n.status !== 'sent').length
      },
      notifications: notifications
    })

  } catch (error) {
    console.error('❌ Error en proceso de notificaciones:', error)
    
    return NextResponse.json(
      { 
        error: 'Error procesando notificaciones',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

function getContextualKeyboard(type: string) {
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
          { text: '🌅 Actividad Matutina', callback_data: 'view_activities' },
          { text: '🙏 Momento de Gratitud', callback_data: 'view_activities' }
        ],
        ...baseKeyboard
      ]

    case 'afternoon':
      return [
        [
          { text: '🔄 Check-in Rápido', callback_data: 'mood_checkin' },
          { text: '💨 Respiración', callback_data: 'view_activities' }
        ],
        ...baseKeyboard
      ]

    case 'evening':
      return [
        [
          { text: '🌙 Reflexión', callback_data: 'view_activities' },
          { text: '🙏 Oración', callback_data: 'view_activities' }
        ],
        ...baseKeyboard
      ]

    default:
      return baseKeyboard
  }
}