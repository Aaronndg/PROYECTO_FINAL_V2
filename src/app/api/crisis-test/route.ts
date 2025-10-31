import { NextRequest, NextResponse } from 'next/server'
import { 
  detectCrisisKeywords, 
  processCrisisAlert,
  getCrisisResponseMessage 
} from '@/lib/crisis-alert-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, userId } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    console.log('🧪 Testing crisis detection for message:', message)

    // Detect crisis keywords
    const crisisDetection = detectCrisisKeywords(message)
    console.log('📊 Crisis detection result:', crisisDetection)

    let alertResult = null
    if (crisisDetection.riskLevel === 'crisis' || crisisDetection.riskLevel === 'high') {
      // Process crisis alert
      alertResult = await processCrisisAlert(
        userId || 'test-user',
        message,
        crisisDetection.riskLevel as 'high' | 'crisis',
        crisisDetection.triggerWords
      )
      console.log('🚨 Crisis alert processed:', alertResult)
    }

    const crisisMessage = (crisisDetection.riskLevel === 'crisis' || crisisDetection.riskLevel === 'high') 
      ? getCrisisResponseMessage(crisisDetection.riskLevel as 'high' | 'crisis')
      : null

    return NextResponse.json({
      success: true,
      detection: crisisDetection,
      alert: alertResult,
      crisisMessage,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error testing crisis detection:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    info: 'Crisis Detection Test Endpoint',
    testMessages: [
      'me quiero morir',
      'no quiero vivir más',
      'voy a hacerme daño',
      'me siento muy deprimido',
      'estoy ansioso',
      'todo está bien'
    ],
    riskLevels: ['low', 'medium', 'high', 'crisis']
  })
}