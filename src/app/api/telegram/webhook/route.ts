import { NextRequest, NextResponse } from 'next/server'

// Telegram Bot API types
interface TelegramUpdate {
  update_id: number
  message?: TelegramMessage
  callback_query?: TelegramCallbackQuery
}

interface TelegramMessage {
  message_id: number
  from: TelegramUser
  chat: TelegramChat
  date: number
  text?: string
}

interface TelegramCallbackQuery {
  id: string
  from: TelegramUser
  message: TelegramMessage
  data: string
}

interface TelegramUser {
  id: number
  is_bot: boolean
  first_name: string
  last_name?: string
  username?: string
}

interface TelegramChat {
  id: number
  type: string
  first_name?: string
  last_name?: string
  username?: string
}

// Bot configuration
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`

// Verificar el webhook
export async function GET() {
  return NextResponse.json({ status: 'Telegram webhook is active' })
}

// Manejar actualizaciones del bot
export async function POST(request: NextRequest) {
  try {
    if (!BOT_TOKEN) {
      console.error('TELEGRAM_BOT_TOKEN no está configurado')
      return NextResponse.json({ error: 'Bot token no configurado' }, { status: 500 })
    }

    const update: TelegramUpdate = await request.json()
    
    // Manejar mensajes de texto
    if (update.message?.text) {
      await handleTextMessage(update.message)
    }
    
    // Manejar callback queries (botones inline)
    if (update.callback_query) {
      await handleCallbackQuery(update.callback_query)
    }

    return NextResponse.json({ ok: true })

  } catch (error) {
    console.error('Error processing Telegram update:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// Manejar mensajes de texto
async function handleTextMessage(message: TelegramMessage) {
  const chatId = message.chat.id
  const text = message.text || ''
  const userId = message.from.id

  // Registrar usuario si es la primera vez
  await registerUserIfNeeded(userId, message.from)

  // Comandos del bot
  if (text.startsWith('/')) {
    await handleCommand(chatId, text, userId)
  } else {
    // Mensaje libre - responder con IA
    await handleAIResponse(chatId, text, userId)
  }
}

// Manejar comandos
async function handleCommand(chatId: number, command: string, userId: number) {
  switch (command.toLowerCase()) {
    case '/start':
      await sendWelcomeMessage(chatId)
      break
    
    case '/help':
      await sendHelpMessage(chatId)
      break
    
    case '/versiculo':
    case '/verse':
      await sendDailyVerse(chatId, userId)
      break
    
    case '/animo':
    case '/mood':
      await sendMoodCheckIn(chatId)
      break
    
    case '/oracion':
    case '/prayer':
      await sendPrayerPrompt(chatId)
      break
    
    case '/test':
      await sendQuickTest(chatId)
      break
    
    case '/comunidad':
    case '/community':
      await sendCommunityOptions(chatId)
      break
    
    case '/recordatorio':
    case '/reminder':
      await sendReminderOptions(chatId)
      break
    
    default:
      await sendUnknownCommand(chatId)
  }
}

// Mensaje de bienvenida
async function sendWelcomeMessage(chatId: number) {
  const welcomeText = `
🙏 ¡Bienvenido a SerenIA! 

Soy tu asistente espiritual y de bienestar. Estoy aquí para acompañarte en tu crecimiento espiritual y emocional.

✨ **¿Qué puedo hacer por ti?**
• Compartir versículos diarios personalizados
• Ayudarte con reflexiones y oraciones
• Realizar evaluaciones de bienestar rápidas
• Conectarte con la comunidad cristiana
• Enviarte recordatorios de cuidado espiritual

📱 **Comandos disponibles:**
/versiculo - Versículo del día
/animo - Evalúa tu estado de ánimo
/oracion - Momento de oración guiada
/test - Evaluación rápida de bienestar
/comunidad - Ver actividad comunitaria
/recordatorio - Configurar recordatorios
/help - Ver todos los comandos

💬 También puedes escribirme libremente y responderé con sabiduría bíblica y apoyo emocional.

¿Cómo puedo acompañarte hoy? 🤗
`

  await sendMessage(chatId, welcomeText, getMainMenuKeyboard())
}

// Mensaje de ayuda
async function sendHelpMessage(chatId: number) {
  const helpText = `
📖 **Comandos de SerenIA**

🙏 **Espirituales:**
/versiculo - Recibe un versículo personalizado
/oracion - Momento de oración guiada
/comunidad - Ver notas de la comunidad

💙 **Bienestar:**
/animo - Evalúa tu estado emocional
/test - Test rápido de bienestar
/recordatorio - Configurar notificaciones

🤖 **General:**
/start - Mensaje de bienvenida
/help - Esta ayuda

💬 **Conversación libre:**
Escríbeme cualquier pregunta o preocupación y te responderé con sabiduría bíblica y apoyo emocional.

🌐 **Aplicación web:** Visita [SerenIA](https://serenia.app) para acceder a todas las funcionalidades.
`

  await sendMessage(chatId, helpText)
}

// Enviar versículo diario
async function sendDailyVerse(chatId: number, userId: number) {
  try {
    // Aquí se implementaría la lógica para obtener un versículo personalizado
    // Por ahora usamos un versículo estático
    const verse = {
      reference: "Filipenses 4:19",
      text: "Mi Dios, pues, suplirá todo lo que os falta conforme a sus riquezas en gloria en Cristo Jesús.",
      reflection: "Dios conoce todas nuestras necesidades y promete suplirlas. Podemos confiar en Su provisión perfecta."
    }

    const verseText = `
📖 **Versículo del día**

*"${verse.text}"*
**${verse.reference}**

💭 **Reflexión:** ${verse.reflection}

🙏 Que esta palabra de Dios ilumine tu día y fortalezca tu fe.
`

    const keyboard = {
      inline_keyboard: [
        [
          { text: '❤️ Me gusta', callback_data: 'like_verse' },
          { text: '💫 Compartir', callback_data: 'share_verse' }
        ],
        [
          { text: '🔄 Otro versículo', callback_data: 'another_verse' },
          { text: '🙏 Momento de oración', callback_data: 'prayer_moment' }
        ]
      ]
    }

    await sendMessage(chatId, verseText, keyboard)

  } catch (error) {
    console.error('Error sending daily verse:', error)
    await sendMessage(chatId, '❌ Error al obtener el versículo. Inténtalo de nuevo.')
  }
}

// Check-in de estado de ánimo
async function sendMoodCheckIn(chatId: number) {
  const moodText = `
💙 **¿Cómo te sientes hoy?**

Selecciona la opción que mejor describa tu estado actual:
`

  const keyboard = {
    inline_keyboard: [
      [
        { text: '😊 Muy bien', callback_data: 'mood_excellent' },
        { text: '🙂 Bien', callback_data: 'mood_good' }
      ],
      [
        { text: '😐 Regular', callback_data: 'mood_okay' },
        { text: '😔 Mal', callback_data: 'mood_bad' }
      ],
      [
        { text: '😢 Muy mal', callback_data: 'mood_terrible' }
      ],
      [
        { text: '📊 Ver mi progreso', callback_data: 'view_mood_progress' }
      ]
    ]
  }

  await sendMessage(chatId, moodText, keyboard)
}

// Prompt de oración
async function sendPrayerPrompt(chatId: number) {
  const prayers = [
    {
      title: "Oración por la paz",
      text: "Señor, concédeme la serenidad para aceptar las cosas que no puedo cambiar, el valor para cambiar las que sí puedo, y la sabiduría para conocer la diferencia."
    },
    {
      title: "Oración por fortaleza",
      text: "Padre celestial, cuando me sienta débil, recuérdame que en Ti encuentro mi fortaleza. Ayúdame a confiar en Tu poder que se perfecciona en mi debilidad."
    },
    {
      title: "Oración por gratitud",
      text: "Gracias, Señor, por todas las bendiciones de este día. Ayúdame a tener un corazón agradecido que reconozca Tu bondad en cada momento."
    }
  ]

  const randomPrayer = prayers[Math.floor(Math.random() * prayers.length)]

  const prayerText = `
🙏 **${randomPrayer.title}**

*${randomPrayer.text}*

Tómate un momento para hacer esta oración tu propia. Dios escucha cada susurro de tu corazón.

💭 ¿Hay algo específico por lo que te gustaría orar hoy?
`

  const keyboard = {
    inline_keyboard: [
      [
        { text: '🙏 Otra oración', callback_data: 'another_prayer' },
        { text: '💬 Petición personal', callback_data: 'personal_prayer' }
      ],
      [
        { text: '📖 Versículo relacionado', callback_data: 'prayer_verse' }
      ]
    ]
  }

  await sendMessage(chatId, prayerText, keyboard)
}

// Test rápido
async function sendQuickTest(chatId: number) {
  const testText = `
📋 **Evaluación rápida de bienestar**

Responde esta pregunta para una evaluación inmediata:

**¿Qué tan estresado te has sentido en los últimos 3 días?**
`

  const keyboard = {
    inline_keyboard: [
      [
        { text: '1 - Nada estresado', callback_data: 'stress_1' },
        { text: '2 - Poco estresado', callback_data: 'stress_2' }
      ],
      [
        { text: '3 - Moderadamente', callback_data: 'stress_3' },
        { text: '4 - Bastante estresado', callback_data: 'stress_4' }
      ],
      [
        { text: '5 - Muy estresado', callback_data: 'stress_5' }
      ],
      [
        { text: '📊 Test completo en la app', callback_data: 'full_test' }
      ]
    ]
  }

  await sendMessage(chatId, testText, keyboard)
}

// Opciones de comunidad
async function sendCommunityOptions(chatId: number) {
  const communityText = `
👥 **Comunidad SerenIA**

Conecta con hermanos en la fe y comparte tu jornada espiritual:
`

  const keyboard = {
    inline_keyboard: [
      [
        { text: '📝 Últimas reflexiones', callback_data: 'latest_notes' },
        { text: '🙏 Peticiones de oración', callback_data: 'prayer_requests' }
      ],
      [
        { text: '💭 Compartir testimonio', callback_data: 'share_testimony' },
        { text: '🤗 Palabras de ánimo', callback_data: 'encouragement' }
      ],
      [
        { text: '🌐 Abrir en la app', callback_data: 'open_community_app' }
      ]
    ]
  }

  await sendMessage(chatId, communityText, keyboard)
}

// Opciones de recordatorio
async function sendReminderOptions(chatId: number) {
  const reminderText = `
⏰ **Recordatorios de bienestar**

Configura notificaciones personalizadas para cuidar tu alma:
`

  const keyboard = {
    inline_keyboard: [
      [
        { text: '📖 Versículo diario', callback_data: 'reminder_verse' },
        { text: '🙏 Momento de oración', callback_data: 'reminder_prayer' }
      ],
      [
        { text: '💙 Check-in emocional', callback_data: 'reminder_mood' },
        { text: '📊 Evaluación semanal', callback_data: 'reminder_test' }
      ],
      [
        { text: '⚙️ Configurar horarios', callback_data: 'configure_reminders' }
      ]
    ]
  }

  await sendMessage(chatId, reminderText, keyboard)
}

// Comando desconocido
async function sendUnknownCommand(chatId: number) {
  const unknownText = `
❓ No reconozco ese comando. 

Usa /help para ver todos los comandos disponibles, o simplemente escríbeme libremente y responderé con sabiduría bíblica.

¿En qué puedo ayudarte hoy? 🤗
`

  await sendMessage(chatId, unknownText, getMainMenuKeyboard())
}

// Manejar respuestas de IA
async function handleAIResponse(chatId: number, text: string, userId: number) {
  try {
    // Enviar indicador de "escribiendo"
    await sendChatAction(chatId, 'typing')

    // Aquí se implementaría la integración con la API de IA
    // Por ahora usamos una respuesta estática contextual
    const response = await generateAIResponse(text)

    await sendMessage(chatId, response)

  } catch (error) {
    console.error('Error generating AI response:', error)
    await sendMessage(chatId, '❌ Disculpa, tuve un problema procesando tu mensaje. ¿Podrías intentar de nuevo?')
  }
}

// Generar respuesta de IA
async function generateAIResponse(userMessage: string): Promise<string> {
  // Esta función se integraría con la API de DeepSeek
  // Por ahora retorna respuestas contextuales estáticas
  
  const message = userMessage.toLowerCase()
  
  if (message.includes('triste') || message.includes('deprim') || message.includes('mal')) {
    return `
💙 Entiendo que estás pasando por un momento difícil. Recuerda las palabras de Jesús:

*"Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar."* - Mateo 11:28

🙏 Estoy aquí para acompañarte. ¿Te gustaría que oremos juntos o prefieres hablar sobre lo que te preocupa?

Usa /oracion para un momento de oración guiada.
`
  }
  
  if (message.includes('ansi') || message.includes('preocup') || message.includes('miedo')) {
    return `
🕊️ La ansiedad es comprensible, pero no tienes que cargarla solo:

*"Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias."* - Filipenses 4:6

💭 **Técnica de respiración:** Respira profundo 4 veces, entregando cada preocupación a Dios.

¿Quieres hacer una evaluación rápida de ansiedad? Usa /test
`
  }
  
  if (message.includes('gracias') || message.includes('bendic')) {
    return `
🙏 ¡Qué hermoso corazón agradecido! La gratitud transforma nuestro corazón:

*"Dad gracias en todo, porque esta es la voluntad de Dios para con vosotros en Cristo Jesús."* - 1 Tesalonicenses 5:18

✨ Que Dios continúe llenando tu vida de razones para ser agradecido.
`
  }
  
  // Respuesta general
  return `
🤗 Gracias por compartir conmigo. Dios escucha cada palabra de tu corazón.

💭 Recuerda que *"a los que aman a Dios, todas las cosas les ayudan a bien"* - Romanos 8:28

¿Hay algo específico en lo que pueda ayudarte? Puedes usar:
• /versiculo para palabras de aliento
• /oracion para un momento de paz
• /animo para evaluar cómo te sientes
`
}

// Manejar callback queries
async function handleCallbackQuery(callbackQuery: TelegramCallbackQuery) {
  const chatId = callbackQuery.message.chat.id
  const data = callbackQuery.data
  const messageId = callbackQuery.message.message_id

  // Responder al callback para quitar el loading
  await answerCallbackQuery(callbackQuery.id)

  // Procesar la acción
  switch (data) {
    case 'like_verse':
      await editMessage(chatId, messageId, '❤️ ¡Versículo guardado en favoritos!')
      break
    
    case 'another_verse':
      await sendDailyVerse(chatId, callbackQuery.from.id)
      break
    
    case 'prayer_moment':
      await sendPrayerPrompt(chatId)
      break
    
    case 'mood_excellent':
    case 'mood_good':
    case 'mood_okay':
    case 'mood_bad':
    case 'mood_terrible':
      await handleMoodResponse(chatId, data)
      break
    
    case 'stress_1':
    case 'stress_2':
    case 'stress_3':
    case 'stress_4':
    case 'stress_5':
      await handleStressResponse(chatId, data)
      break
    
    default:
      await sendMessage(chatId, '🔄 Función en desarrollo. Pronto estará disponible.')
  }
}

// Manejar respuesta de estado de ánimo
async function handleMoodResponse(chatId: number, moodData: string) {
  const moodMap: { [key: string]: { emoji: string, level: string, message: string } } = {
    'mood_excellent': {
      emoji: '😊',
      level: 'excelente',
      message: '¡Qué alegría saber que te sientes excelente! Que Dios continúe llenando tu corazón de gozo.'
    },
    'mood_good': {
      emoji: '🙂',
      level: 'bien',
      message: 'Me alegra que te sientas bien. Sigue cuidando tu bienestar emocional y espiritual.'
    },
    'mood_okay': {
      emoji: '😐',
      level: 'regular',
      message: 'Entiendo que hoy es un día regular. Recuerda que Dios está contigo en cada momento.'
    },
    'mood_bad': {
      emoji: '😔',
      level: 'mal',
      message: 'Lamento que no te sientes bien. Recuerda que las tormentas pasan y Dios nunca te abandona.'
    },
    'mood_terrible': {
      emoji: '😢',
      level: 'muy mal',
      message: 'Mi corazón está contigo en este momento difícil. Dios ve tus lágrimas y tiene planes de bien para ti.'
    }
  }

  const mood = moodMap[moodData]
  
  const responseText = `
${mood.emoji} **Estado registrado: ${mood.level}**

${mood.message}

🙏 *"Jehová está cerca de los quebrantados de corazón; y salva a los contritos de espíritu."* - Salmos 34:18

¿Te gustaría hacer algo para cuidar tu bienestar?
`

  const keyboard = {
    inline_keyboard: [
      [
        { text: '🙏 Momento de oración', callback_data: 'prayer_moment' },
        { text: '📖 Versículo de aliento', callback_data: 'another_verse' }
      ],
      [
        { text: '📊 Ver mi progreso', callback_data: 'view_mood_progress' }
      ]
    ]
  }

  await sendMessage(chatId, responseText, keyboard)
}

// Manejar respuesta de estrés
async function handleStressResponse(chatId: number, stressData: string) {
  const stressLevel = parseInt(stressData.split('_')[1])
  
  let message = ''
  let suggestions = []

  if (stressLevel <= 2) {
    message = '✨ ¡Excelente! Tu nivel de estrés es bajo. Sigue cuidando tu bienestar.'
    suggestions = ['📖 Lectura devocional', '🙏 Oración de gratitud']
  } else if (stressLevel === 3) {
    message = '💛 Nivel moderado de estrés. Es normal, pero cuidemos tu bienestar.'
    suggestions = ['🧘 Respiración consciente', '📖 Versículo calmante']
  } else {
    message = '❤️ Nivel alto de estrés. Dios quiere darte descanso y paz.'
    suggestions = ['🙏 Oración por paz', '📞 Considera hablar con alguien']
  }

  const responseText = `
📊 **Nivel de estrés: ${stressLevel}/5**

${message}

*"Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros."* - 1 Pedro 5:7

💭 **Sugerencias:**
${suggestions.map(s => `• ${s}`).join('\n')}
`

  const keyboard = {
    inline_keyboard: [
      [
        { text: '🙏 Oración por paz', callback_data: 'prayer_moment' },
        { text: '📖 Versículo calmante', callback_data: 'another_verse' }
      ],
      [
        { text: '📊 Test completo', callback_data: 'full_test' }
      ]
    ]
  }

  await sendMessage(chatId, responseText, keyboard)
}

// Registrar usuario si es necesario
async function registerUserIfNeeded(telegramId: number, user: TelegramUser) {
  // Aquí se implementaría la lógica para verificar y registrar usuarios en la base de datos
  console.log(`Registering user if needed: ${user.first_name} (${telegramId})`)
}

// Funciones auxiliares para la API de Telegram
async function sendMessage(chatId: number, text: string, replyMarkup?: any) {
  const url = `${TELEGRAM_API_URL}/sendMessage`
  
  const payload = {
    chat_id: chatId,
    text: text,
    parse_mode: 'Markdown',
    reply_markup: replyMarkup
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`Telegram API error: ${response.status}`)
  }

  return response.json()
}

async function editMessage(chatId: number, messageId: number, text: string, replyMarkup?: any) {
  const url = `${TELEGRAM_API_URL}/editMessageText`
  
  const payload = {
    chat_id: chatId,
    message_id: messageId,
    text: text,
    parse_mode: 'Markdown',
    reply_markup: replyMarkup
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  })

  return response.ok
}

async function sendChatAction(chatId: number, action: string) {
  const url = `${TELEGRAM_API_URL}/sendChatAction`
  
  const payload = {
    chat_id: chatId,
    action: action
  }

  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  })
}

async function answerCallbackQuery(callbackQueryId: string, text?: string) {
  const url = `${TELEGRAM_API_URL}/answerCallbackQuery`
  
  const payload = {
    callback_query_id: callbackQueryId,
    text: text || ''
  }

  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload)
  })
}

// Teclado del menú principal
function getMainMenuKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: '📖 Versículo del día', callback_data: 'daily_verse' },
        { text: '💙 ¿Cómo estás?', callback_data: 'mood_checkin' }
      ],
      [
        { text: '🙏 Momento de oración', callback_data: 'prayer_moment' },
        { text: '📊 Test rápido', callback_data: 'quick_test' }
      ],
      [
        { text: '👥 Comunidad', callback_data: 'community_options' },
        { text: '⏰ Recordatorios', callback_data: 'reminder_options' }
      ]
    ]
  }
}