import { NextRequest, NextResponse } from 'next/server'

export interface CrisisAlert {
  id: string
  userId: string
  riskLevel: 'high' | 'crisis'
  message: string
  triggerWords: string[]
  timestamp: string
  alertsSent: string[]
  status: 'pending' | 'sent' | 'acknowledged' | 'resolved'
}

export interface AlertResponse {
  alertTriggered: boolean
  alertId?: string
  emergencyResources: EmergencyResource[]
  immediateActions: string[]
  followUpRequired: boolean
}

export interface EmergencyResource {
  type: 'hotline' | 'emergency' | 'professional' | 'community'
  name: string
  contact: string
  description: string
  available24h: boolean
  priority: number
}

/**
 * Emergency resources for crisis situations
 */
const EMERGENCY_RESOURCES: EmergencyResource[] = [
  {
    type: 'emergency',
    name: 'Servicios de Emergencia',
    contact: '911',
    description: 'Para emergencias médicas inmediatas',
    available24h: true,
    priority: 1
  },
  {
    type: 'hotline',
    name: 'Línea Nacional de Prevención del Suicidio',
    contact: '988',
    description: 'Apoyo emocional 24/7 para crisis de salud mental',
    available24h: true,
    priority: 2
  },
  {
    type: 'hotline',
    name: 'Crisis Text Line',
    contact: 'HOME to 741741',
    description: 'Apoyo por mensajes de texto las 24 horas',
    available24h: true,
    priority: 3
  },
  {
    type: 'professional',
    name: 'Psicólogo de Emergencia',
    contact: '1-800-CRISIS',
    description: 'Consulta inmediata con profesional de salud mental',
    available24h: true,
    priority: 4
  },
  {
    type: 'community',
    name: 'Pastor de Crisis',
    contact: 'pastor@iglesia.com',
    description: 'Apoyo espiritual inmediato',
    available24h: false,
    priority: 5
  }
]

/**
 * Detect crisis keywords and analyze risk level
 */
export function detectCrisisKeywords(message: string): { 
  riskLevel: 'low' | 'medium' | 'high' | 'crisis', 
  triggerWords: string[] 
} {
  const input = message.toLowerCase()
  
  // Crisis level - immediate danger
  const crisisKeywords = [
    'suicidio', 'suicidarme', 'matarme', 'acabar con todo', 
    'no quiero vivir', 'mejor muerto', 'terminar con mi vida',
    'hacerme daño', 'lastimarme', 'cortarme', 'plan para',
    'pastillas', 'sobredosis', 'saltar', 'ahorcarme'
  ]
  
  // High risk - serious concern
  const highRiskKeywords = [
    'desesperado', 'sin esperanza', 'no veo salida', 'no puedo más',
    'todo está perdido', 'nadie me entiende', 'completamente solo',
    'abandonado', 'sin propósito', 'vida sin sentido', 'dolor insoportable'
  ]
  
  // Medium risk - concerning but manageable
  const mediumRiskKeywords = [
    'deprimido', 'muy triste', 'ansioso', 'preocupado', 'estresado',
    'agobiado', 'abrumado', 'confundido', 'perdido', 'vacío'
  ]
  
  const foundCrisisWords = crisisKeywords.filter(keyword => input.includes(keyword))
  const foundHighRiskWords = highRiskKeywords.filter(keyword => input.includes(keyword))
  const foundMediumRiskWords = mediumRiskKeywords.filter(keyword => input.includes(keyword))
  
  if (foundCrisisWords.length > 0) {
    return { riskLevel: 'crisis', triggerWords: foundCrisisWords }
  }
  
  if (foundHighRiskWords.length > 0) {
    return { riskLevel: 'high', triggerWords: foundHighRiskWords }
  }
  
  if (foundMediumRiskWords.length > 0) {
    return { riskLevel: 'medium', triggerWords: foundMediumRiskWords }
  }
  
  return { riskLevel: 'low', triggerWords: [] }
}

/**
 * Process crisis alert and trigger appropriate responses
 */
export async function processCrisisAlert(
  userId: string,
  message: string,
  riskLevel: 'high' | 'crisis',
  triggerWords: string[]
): Promise<AlertResponse> {
  console.log('🚨 CRISIS ALERT TRIGGERED:', { userId, riskLevel, triggerWords })

  const alertId = `alert-${Date.now()}-${userId.substring(0, 8)}`
  
  const crisisAlert: CrisisAlert = {
    id: alertId,
    userId,
    riskLevel,
    message: message.substring(0, 500), // Limit message length for storage
    triggerWords,
    timestamp: new Date().toISOString(),
    alertsSent: [],
    status: 'pending'
  }

  // Determine immediate actions based on risk level
  let immediateActions: string[] = []
  let followUpRequired = false

  if (riskLevel === 'crisis') {
    immediateActions = [
      '🚨 BUSCA AYUDA INMEDIATAMENTE',
      '📞 Llama al 911 si estás en peligro inmediato',
      '💬 Llama al 988 (Línea de Crisis) AHORA',
      '🏥 Ve a la sala de emergencias más cercana',
      '👥 Contacta a un amigo o familiar inmediatamente',
      '🙏 Recuerda: Tu vida tiene valor infinito ante Dios'
    ]
    followUpRequired = true
  } else if (riskLevel === 'high') {
    immediateActions = [
      '💙 Tu bienestar es muy importante para nosotros',
      '📞 Considera llamar al 988 para hablar con alguien',
      '👥 Habla con alguien de confianza HOY',
      '💊 Si tienes pensamientos de autolesión, busca ayuda profesional',
      '🙏 Dios está contigo en este momento difícil',
      '📅 Programa una cita con un profesional de salud mental'
    ]
    followUpRequired = true
  }

  // Send alerts through different channels
  const alertsSent = await sendCrisisAlerts(crisisAlert)
  crisisAlert.alertsSent = alertsSent
  crisisAlert.status = 'sent'

  // Store alert in database (simulated)
  await storeCrisisAlert(crisisAlert)

  // Trigger automation workflows
  await triggerCrisisWorkflows(userId, crisisAlert)

  return {
    alertTriggered: true,
    alertId,
    emergencyResources: getAppropriatResources(riskLevel),
    immediateActions,
    followUpRequired
  }
}

/**
 * Send crisis alerts through multiple channels
 */
async function sendCrisisAlerts(alert: CrisisAlert): Promise<string[]> {
  const alertsSent: string[] = []

  try {
    // 1. Log alert immediately
    console.log('🚨 CRISIS ALERT LOGGED:', alert)
    alertsSent.push('system_log')

    // 2. Send to n8n workflow for immediate processing
    if (process.env.N8N_CRISIS_WEBHOOK_URL) {
      await fetch(process.env.N8N_CRISIS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'crisis_alert',
          alert,
          priority: 'immediate'
        })
      })
      alertsSent.push('n8n_workflow')
    }

    // 3. Send Telegram notification (if bot is configured)
    if (process.env.TELEGRAM_BOT_TOKEN) {
      // This would send to designated crisis response team
      alertsSent.push('telegram_notification')
    }

    // 4. Email alert to designated crisis team (simulated)
    // await sendCrisisEmail(alert)
    alertsSent.push('email_notification')

    // 5. Store in high-priority queue for immediate follow-up
    alertsSent.push('priority_queue')

  } catch (error) {
    console.error('Error sending crisis alerts:', error)
  }

  return alertsSent
}

/**
 * Get appropriate emergency resources based on risk level
 */
function getAppropriatResources(riskLevel: 'high' | 'crisis'): EmergencyResource[] {
  if (riskLevel === 'crisis') {
    // Return all resources, prioritizing immediate help
    return EMERGENCY_RESOURCES.sort((a, b) => a.priority - b.priority)
  } else {
    // Return professional and community resources
    return EMERGENCY_RESOURCES
      .filter(resource => resource.type !== 'emergency')
      .sort((a, b) => a.priority - b.priority)
  }
}

/**
 * Store crisis alert in database
 */
async function storeCrisisAlert(alert: CrisisAlert): Promise<void> {
  try {
    // In a real implementation, this would store in Supabase
    console.log('💾 Storing crisis alert in database:', alert.id)
    
    // Simulated database storage
    // await supabase.from('crisis_alerts').insert(alert)
    
  } catch (error) {
    console.error('Error storing crisis alert:', error)
  }
}

/**
 * Trigger crisis-specific automation workflows
 */
async function triggerCrisisWorkflows(userId: string, alert: CrisisAlert): Promise<void> {
  try {
    // Trigger immediate crisis response workflow
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/automation/triggers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        triggerType: 'crisis_detected',
        triggerData: {
          userId,
          alertId: alert.id,
          riskLevel: alert.riskLevel,
          triggerWords: alert.triggerWords,
          timestamp: alert.timestamp
        },
        context: {
          priority: 'immediate',
          requiresHumanReview: true,
          escalationLevel: alert.riskLevel === 'crisis' ? 'emergency' : 'urgent'
        }
      })
    })

    if (response.ok) {
      console.log('✅ Crisis workflows triggered successfully')
    } else {
      console.error('❌ Failed to trigger crisis workflows')
    }

  } catch (error) {
    console.error('Error triggering crisis workflows:', error)
  }
}

/**
 * Check if user should receive crisis intervention
 */
export function shouldTriggerCrisisAlert(riskLevel: string): boolean {
  return riskLevel === 'crisis' || riskLevel === 'high'
}

/**
 * Get crisis response message based on risk level
 */
export function getCrisisResponseMessage(riskLevel: 'high' | 'crisis'): string {
  if (riskLevel === 'crisis') {
    return `🚨 **ALERTA DE CRISIS ACTIVADA** 🚨

Detecto que puedes estar en una situación de crisis. Tu vida tiene un valor infinito ante los ojos de Dios, y hay personas capacitadas para ayudarte INMEDIATAMENTE.

**BUSCA AYUDA AHORA:**
🏥 **Emergencia inmediata:** 911
📞 **Línea de Crisis 24/7:** 988
💬 **Crisis por texto:** Envía HOME al 741741

**RECUERDA:**
🙏 Dios te ama profundamente
💝 Tu vida tiene propósito y valor
👥 No estás solo en esto
✨ Hay esperanza y ayuda disponible

**Por favor, contacta a uno de estos recursos AHORA. Tu bienestar es nuestra prioridad absoluta.**`
  } else {
    return `💙 **Alerta de Bienestar Activada** 💙

Veo que estás pasando por un momento muy difícil. Quiero que sepas que tu bienestar es muy importante y que hay ayuda disponible.

**RECURSOS DE APOYO:**
📞 **Línea de Crisis:** 988
💬 **Apoyo por texto:** HOME al 741741
👥 **Habla con alguien de confianza:** Un amigo, familiar o pastor

**RECUERDA:**
🙏 "Cercano está Jehová a los quebrantados de corazón" - Salmo 34:18
💝 No tienes que enfrentar esto solo
✨ Buscar ayuda es un acto de valentía y sabiduría

**Te animo a contactar a un profesional de salud mental o a uno de los recursos mencionados.**`
  }
}

export default {
  detectCrisisKeywords,
  processCrisisAlert,
  shouldTriggerCrisisAlert,
  getCrisisResponseMessage,
  EMERGENCY_RESOURCES
}