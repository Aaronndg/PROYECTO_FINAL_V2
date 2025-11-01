import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { message, context } = body

    if (!message) {
      return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 })
    }

    // Preparar el prompt específico para búsqueda de versículos
    const systemPrompt = `
Eres SerenIA, un asistente espiritual especializado en encontrar versículos bíblicos que hablen al corazón de las personas según sus necesidades emocionales y espirituales.

INSTRUCCIONES IMPORTANTES:
1. Analiza el estado emocional y las necesidades espirituales del usuario
2. Responde con MÁXIMO 2-3 versículos bíblicos relevantes
3. Incluye SIEMPRE la referencia bíblica completa (libro, capítulo:versículo)
4. Ofrece versículos de diferentes versiones si es apropiado (RV60 y NTV)
5. Explica brevemente por qué cada versículo es relevante para su situación
6. Mantén un tono cálido, empático y esperanzador
7. Si detectas crisis emocional, incluye versículos de esperanza y recomienda buscar ayuda profesional

FORMATO DE RESPUESTA:
- Saludo empático
- 2-3 versículos con sus referencias
- Breve explicación de cada versículo
- Mensaje de ánimo y esperanza

CONTEXTO: El usuario está buscando versículos bíblicos específicos para su situación.
`

    const userPrompt = `
El usuario dice: "${message}"

Por favor, ayúdame a encontrar versículos bíblicos que hablen a su corazón según lo que me está compartiendo. 
Necesito versículos que sean relevantes, consoladores y que le den esperanza.
`

    // Llamar a la API de DeepSeek
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error('Error en la API de DeepSeek')
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content || 'Lo siento, no pude procesar tu mensaje.'

    // Simular versículos sugeridos basados en palabras clave comunes
    let suggestedVerses = []
    
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('ansio') || lowerMessage.includes('preocup') || lowerMessage.includes('miedo')) {
      suggestedVerses = [
        {
          id: '1',
          reference: 'Filipenses 4:6-7',
          text_rv60: 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.',
          text_ntv: 'No se preocupen por nada; en cambio, oren por todo. Díganle a Dios lo que necesitan y denle gracias por todo lo que él ha hecho. Así experimentarán la paz de Dios, que supera todo lo que podemos entender. La paz de Dios cuidará su corazón y su mente mientras vivan en Cristo Jesús.',
          mood_tags: ['ansiedad', 'paz', 'oración']
        }
      ]
    } else if (lowerMessage.includes('trist') || lowerMessage.includes('desanim') || lowerMessage.includes('deprim')) {
      suggestedVerses = [
        {
          id: '2',
          reference: 'Salmos 34:18',
          text_rv60: 'Cercano está Jehová a los quebrantados de corazón; Y salva a los contritos de espíritu.',
          text_ntv: 'El Señor está cerca de los que tienen quebrantado el corazón; él rescata a los de espíritu destrozado.',
          mood_tags: ['tristeza', 'consuelo', 'esperanza']
        }
      ]
    } else if (lowerMessage.includes('amor') || lowerMessage.includes('perdón')) {
      suggestedVerses = [
        {
          id: '3',
          reference: '1 Juan 4:19',
          text_rv60: 'Nosotros le amamos a él, porque él nos amó primero.',
          text_ntv: 'Nosotros amamos porque él nos amó primero.',
          mood_tags: ['amor', 'relación con Dios']
        }
      ]
    }

    // Log de la interacción
    console.log(`[VERSES CHAT] Usuario: ${session.user.email} | Mensaje: ${message.substring(0, 100)}...`)

    return NextResponse.json({
      response: aiResponse,
      suggested_verses: suggestedVerses,
      context: 'verses_search'
    })

  } catch (error) {
    console.error('Error en verses chat:', error)
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        response: 'Lo siento, hubo un problema al procesar tu mensaje. Por favor intenta de nuevo.'
      }, 
      { status: 500 }
    )
  }
}