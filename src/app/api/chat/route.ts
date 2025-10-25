import { NextRequest, NextResponse } from 'next/server'
import { generateEmpatheticResponse } from '@/lib/ai-service'

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Chat API: Processing request...')
    
    const body = await request.json()
    const { message, conversationHistory, userId } = body

    console.log('📝 Chat API: Received message:', message)
    console.log('👤 Chat API: User ID:', userId)

    if (!message || typeof message !== 'string') {
      console.log('❌ Chat API: Invalid message format')
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const user_id = userId || 'demo-user'

    // Generate AI response with enhanced context
    console.log('🤖 Chat API: Generating AI response...')
    const aiResponse = await generateEmpatheticResponse(
      message,
      undefined, // moodContext
      [], // relevantResources
      conversationHistory || []
    )

    console.log('✅ Chat API: AI response generated successfully')

    // Simple response for now
    const response = {
      content: aiResponse.content,
      emotionDetected: aiResponse.emotionDetected,
      riskLevel: aiResponse.riskLevel,
      suggestedActions: aiResponse.suggestedActions,
      timestamp: new Date().toISOString()
    }

    console.log('📤 Chat API: Sending response:', response.content.substring(0, 100) + '...')
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('❌ Chat API error:', error)
    
    // Return a fallback response for critical errors
    return NextResponse.json({
      content: '💙 Lo siento, estoy teniendo dificultades técnicas en este momento. Pero quiero que sepas que Dios está contigo siempre. Si necesitas ayuda inmediata, por favor contacta a un profesional de la salud mental. 🙏💕',
      emotionDetected: 'neutral',
      riskLevel: 'low',
      suggestedActions: [
        'Toma unos momentos para respirar profundo',
        'Recuerda que Dios te ama incondicionalmente',
        'Considera hablar con alguien de confianza',
        'En caso de emergencia, busca ayuda profesional'
      ],
      timestamp: new Date().toISOString()
    })
  }
}