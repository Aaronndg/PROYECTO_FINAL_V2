import { NextRequest, NextResponse } from 'next/server'
import { generateEmpatheticResponse } from '@/lib/ai-service'
import { emotionalMonitoringService } from '@/lib/emotional-monitoring'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('🎯 Chat API: Processing request...')
    
    const session = await getServerSession(authOptions)
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

    const user_id = session?.user?.id || userId || 'demo-user'

    // Analizar estado emocional del usuario
    console.log('🧠 Chat API: Analyzing emotional state...')
    const emotionalAnalysis = await emotionalMonitoringService.analyzeEmotionalState(
      user_id,
      message,
      'chat'
    )

    // Generar insights personalizados
    const personalizedInsights = emotionalMonitoringService.generatePersonalizedInsights(user_id)

    console.log(`📊 Emotional Analysis: ${emotionalAnalysis.mood_score}/10 (${emotionalAnalysis.improvement_trend})`)

    // Generate AI response with enhanced context
    console.log('🤖 Chat API: Generating AI response...')
    const aiResponse = await generateEmpatheticResponse(
      message,
      emotionalAnalysis, // moodContext
      personalizedInsights, // relevantResources
      conversationHistory || [],
      user_id // Pass userId for crisis detection
    )

    console.log('✅ Chat API: AI response generated successfully')

    // Enhanced response with emotional intelligence
    const response = {
      content: aiResponse.content,
      emotional_analysis: {
        mood_score: emotionalAnalysis.mood_score,
        trend: emotionalAnalysis.improvement_trend,
        insights: emotionalAnalysis.ai_insights,
        is_improving: emotionalAnalysis.improvement_trend === 'improving'
      },
      personalized_insights: personalizedInsights,
      crisis_info: aiResponse.crisis_detected ? {
        risk_level: aiResponse.risk_level,
        resources: aiResponse.emergency_resources
      } : null,
      emotionDetected: aiResponse.emotionDetected,
      riskLevel: aiResponse.riskLevel,
      suggestedActions: aiResponse.suggestedActions,
      crisisAlert: aiResponse.crisisAlert,
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