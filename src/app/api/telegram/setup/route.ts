import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN
    
    if (!token) {
      return NextResponse.json(
        { 
          error: 'TELEGRAM_BOT_TOKEN no está configurado',
          instructions: 'Configura la variable TELEGRAM_BOT_TOKEN en Vercel Environment Variables'
        },
        { status: 400 }
      )
    }

    const url = new URL(request.url)
    const baseUrl = `${url.protocol}//${url.host}`
    const webhookUrl = `${baseUrl}/api/telegram/webhook`

    // Configurar el webhook
    const setWebhookResponse = await fetch(
      `https://api.telegram.org/bot${token}/setWebhook`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['message', 'callback_query'],
          drop_pending_updates: true
        }),
      }
    )

    const webhookResult = await setWebhookResponse.json()

    if (!webhookResult.ok) {
      return NextResponse.json(
        { 
          error: 'Error configurando webhook',
          details: webhookResult,
          troubleshooting: {
            common_issues: [
              'Token incorrecto - Verifica TELEGRAM_BOT_TOKEN',
              'URL no accesible - Asegúrate que el dominio sea público',
              'Bot ya configurado - Revisa con getWebhookInfo'
            ]
          }
        },
        { status: 400 }
      )
    }

    // Obtener información del bot
    const botInfoResponse = await fetch(
      `https://api.telegram.org/bot${token}/getMe`
    )
    const botInfo = await botInfoResponse.json()

    // Obtener información del webhook
    const webhookInfoResponse = await fetch(
      `https://api.telegram.org/bot${token}/getWebhookInfo`
    )
    const webhookInfo = await webhookInfoResponse.json()

    return NextResponse.json({
      success: true,
      message: '🤖 Bot de Telegram configurado exitosamente',
      bot_info: {
        username: botInfo.result?.username,
        first_name: botInfo.result?.first_name,
        id: botInfo.result?.id,
        can_join_groups: botInfo.result?.can_join_groups,
        can_read_all_group_messages: botInfo.result?.can_read_all_group_messages,
        supports_inline_queries: botInfo.result?.supports_inline_queries
      },
      webhook_info: {
        url: webhookInfo.result?.url,
        has_custom_certificate: webhookInfo.result?.has_custom_certificate,
        pending_update_count: webhookInfo.result?.pending_update_count,
        last_error_date: webhookInfo.result?.last_error_date,
        last_error_message: webhookInfo.result?.last_error_message,
        max_connections: webhookInfo.result?.max_connections,
        allowed_updates: webhookInfo.result?.allowed_updates
      },
      next_steps: [
        '✅ Bot configurado correctamente',
        '📱 Busca tu bot en Telegram con @' + (botInfo.result?.username || 'tu_bot'),
        '🚀 Envía /start para probar',
        '⚙️ Prueba todos los comandos: /checkin, /verse, /activity, /crisis',
        '📊 Revisa logs en Vercel Dashboard para monitorear actividad'
      ],
      test_commands: [
        '/start - Iniciar el bot',
        '/checkin - Evaluar estado emocional',
        '/verse - Recibir versículo personalizado',
        '/activity - Actividad de bienestar',
        '/crisis - Ayuda en situaciones críticas',
        '/help - Ver todos los comandos'
      ]
    })

  } catch (error) {
    console.error('❌ Error configurando bot de Telegram:', error)
    
    return NextResponse.json(
      { 
        error: 'Error interno configurando el bot',
        details: error instanceof Error ? error.message : 'Error desconocido',
        troubleshooting: {
          steps: [
            '1. Verifica que TELEGRAM_BOT_TOKEN esté configurado en Vercel',
            '2. Confirma que el token sea válido (obtenido de @BotFather)',
            '3. Asegúrate que el dominio sea accesible públicamente',
            '4. Revisa los logs de Vercel Functions para más detalles'
          ],
          documentation: 'Ver TELEGRAM_BOT_SETUP.md para instrucciones completas'
        }
      },
      { status: 500 }
    )
  }
}

// También permitir POST para reconfigurar
export async function POST(request: NextRequest) {
  return GET(request)
}