interface EmotionalProgress {
  user_id: string
  timestamp: Date
  mood_score: number
  context: 'chat' | 'mood_log' | 'verse_search' | 'crisis_alert'
  improvement_trend: 'improving' | 'stable' | 'declining' | 'crisis'
  ai_insights: string[]
  recommended_actions: string[]
}

interface UserEmotionalProfile {
  user_id: string
  baseline_mood: number
  recent_trend: 'improving' | 'stable' | 'declining' | 'crisis'
  crisis_risk_level: 'low' | 'medium' | 'high' | 'critical'
  preferred_support_type: 'verses' | 'prayer' | 'conversation' | 'professional_help'
  improvement_milestones: string[]
  last_assessment: Date
}

class EmotionalMonitoringService {
  private static instance: EmotionalMonitoringService
  private userProfiles: Map<string, UserEmotionalProfile> = new Map()
  private progressHistory: Map<string, EmotionalProgress[]> = new Map()

  static getInstance(): EmotionalMonitoringService {
    if (!EmotionalMonitoringService.instance) {
      EmotionalMonitoringService.instance = new EmotionalMonitoringService()
    }
    return EmotionalMonitoringService.instance
  }

  // Analizar el estado emocional del usuario basado en sus interacciones
  async analyzeEmotionalState(
    userId: string, 
    message: string, 
    context: 'chat' | 'mood_log' | 'verse_search' | 'crisis_alert',
    moodScore?: number
  ): Promise<EmotionalProgress> {
    // Análisis de sentimientos básico basado en palabras clave
    const emotionalKeywords = {
      positive: ['feliz', 'alegre', 'bendecido', 'agradecido', 'paz', 'esperanza', 'amor', 'gozo'],
      negative: ['triste', 'deprimido', 'ansioso', 'preocupado', 'miedo', 'solo', 'perdido'],
      crisis: ['suicidio', 'muerte', 'acabar', 'terminar', 'no puedo más', 'sin salida', 'desesperado']
    }

    let calculatedMoodScore = moodScore || 5
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
    const insights: string[] = []
    const actions: string[] = []

    const lowerMessage = message.toLowerCase()

    // Detectar palabras de crisis
    if (emotionalKeywords.crisis.some(word => lowerMessage.includes(word))) {
      calculatedMoodScore = Math.min(calculatedMoodScore, 2)
      riskLevel = 'critical'
      insights.push('Detectado lenguaje de crisis - requiere atención inmediata')
      actions.push('Contactar línea de crisis', 'Ofrecer recursos de emergencia', 'Derivar a profesional')
    }

    // Detectar emociones negativas
    const negativeCount = emotionalKeywords.negative.filter(word => lowerMessage.includes(word)).length
    if (negativeCount > 2) {
      calculatedMoodScore = Math.min(calculatedMoodScore, 4)
      riskLevel = negativeCount > 4 ? 'high' : 'medium'
      insights.push('Múltiples indicadores emocionales negativos detectados')
      actions.push('Ofrecer versículos de consuelo', 'Sugerir ejercicios de respiración')
    }

    // Detectar emociones positivas
    const positiveCount = emotionalKeywords.positive.filter(word => lowerMessage.includes(word)).length
    if (positiveCount > 1) {
      calculatedMoodScore = Math.max(calculatedMoodScore, 7)
      insights.push('Estado emocional positivo detectado')
      actions.push('Reforzar pensamientos positivos', 'Compartir versículos de gratitud')
    }

    // Obtener historial del usuario
    const history = this.progressHistory.get(userId) || []
    let trend: 'improving' | 'stable' | 'declining' | 'crisis' = 'stable'

    if (history.length > 0) {
      const recentMoods = history.slice(-5).map(h => h.mood_score)
      const average = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length
      
      if (calculatedMoodScore > average + 1) {
        trend = 'improving'
        insights.push('Tendencia de mejora emocional detectada')
      } else if (calculatedMoodScore < average - 1) {
        trend = 'declining'
        insights.push('Posible deterioro emocional - aumentar apoyo')
        actions.push('Aumentar frecuencia de check-ins', 'Ofrecer recursos adicionales')
      }
    }

    if (riskLevel === 'critical') {
      trend = 'crisis'
    }

    const progress: EmotionalProgress = {
      user_id: userId,
      timestamp: new Date(),
      mood_score: calculatedMoodScore,
      context,
      improvement_trend: trend,
      ai_insights: insights,
      recommended_actions: actions
    }

    // Actualizar historial
    if (!this.progressHistory.has(userId)) {
      this.progressHistory.set(userId, [])
    }
    this.progressHistory.get(userId)!.push(progress)

    // Mantener solo los últimos 50 registros por usuario
    const userHistory = this.progressHistory.get(userId)!
    if (userHistory.length > 50) {
      this.progressHistory.set(userId, userHistory.slice(-50))
    }

    // Actualizar perfil del usuario
    await this.updateUserProfile(userId, progress)

    return progress
  }

  // Actualizar el perfil emocional del usuario
  private async updateUserProfile(userId: string, latestProgress: EmotionalProgress): Promise<void> {
    let profile = this.userProfiles.get(userId)
    
    if (!profile) {
      profile = {
        user_id: userId,
        baseline_mood: latestProgress.mood_score,
        recent_trend: latestProgress.improvement_trend,
        crisis_risk_level: 'low',
        preferred_support_type: 'verses',
        improvement_milestones: [],
        last_assessment: new Date()
      }
    }

    // Actualizar tendencia reciente
    profile.recent_trend = latestProgress.improvement_trend
    profile.last_assessment = new Date()

    // Determinar nivel de riesgo
    const history = this.progressHistory.get(userId) || []
    const recentMoods = history.slice(-7).map(h => h.mood_score)
    const averageRecentMood = recentMoods.reduce((a, b) => a + b, 0) / (recentMoods.length || 1)

    if (latestProgress.improvement_trend === 'crisis') {
      profile.crisis_risk_level = 'critical'
    } else if (averageRecentMood < 3) {
      profile.crisis_risk_level = 'high'
    } else if (averageRecentMood < 5) {
      profile.crisis_risk_level = 'medium'
    } else {
      profile.crisis_risk_level = 'low'
    }

    // Detectar hitos de mejora
    if (latestProgress.improvement_trend === 'improving' && averageRecentMood > profile.baseline_mood + 2) {
      const milestone = `Mejora significativa detectada el ${new Date().toLocaleDateString()}`
      if (!profile.improvement_milestones.includes(milestone)) {
        profile.improvement_milestones.push(milestone)
      }
    }

    this.userProfiles.set(userId, profile)
  }

  // Obtener el perfil emocional actual del usuario
  getUserProfile(userId: string): UserEmotionalProfile | null {
    return this.userProfiles.get(userId) || null
  }

  // Obtener progreso reciente del usuario
  getRecentProgress(userId: string, days: number = 7): EmotionalProgress[] {
    const history = this.progressHistory.get(userId) || []
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    return history.filter(progress => progress.timestamp >= cutoffDate)
  }

  // Generar insights personalizados para el usuario
  generatePersonalizedInsights(userId: string): {
    summary: string
    recommendations: string[]
    encouragement: string
    next_steps: string[]
  } {
    const profile = this.getUserProfile(userId)
    const recentProgress = this.getRecentProgress(userId, 14)

    if (!profile || recentProgress.length === 0) {
      return {
        summary: "Comenzando tu jornada de bienestar emocional.",
        recommendations: ["Comparte cómo te sientes para poder ayudarte mejor"],
        encouragement: "Estoy aquí para acompañarte en este camino.",
        next_steps: ["Cuéntame sobre tu día", "Explora algunos versículos inspiradores"]
      }
    }

    const avgMood = recentProgress.reduce((sum, p) => sum + p.mood_score, 0) / recentProgress.length
    const trend = profile.recent_trend

    // Generar insights específicos para el perfil
    return this.generateDetailedInsights(profile, avgMood, trend, recentProgress)
  }

  // Generar notificaciones para Telegram
  generateTelegramNotifications(userId: string): {
    morning: string
    afternoon: string
    evening: string
    emergency?: string
  } {
    const profile = this.getUserProfile(userId)
    if (!profile) {
      return this.getDefaultTelegramNotifications()
    }

    const morningMessage = this.generateMorningMessage(profile)
    const afternoonMessage = this.generateAfternoonMessage(profile)
    const eveningMessage = this.generateEveningMessage(profile)
    const emergencyMessage = profile.crisis_risk_level === 'critical' 
      ? this.generateEmergencyMessage(profile) 
      : undefined

    return {
      morning: morningMessage,
      afternoon: afternoonMessage,
      evening: eveningMessage,
      emergency: emergencyMessage
    }
  }

  private generateMorningMessage(profile: UserEmotionalProfile): string {
    const name = profile.user_id
    let message = `🌅 ¡Buenos días! `

    if (profile.recent_trend === 'improving') {
      message += `He notado tu progreso positivo. ¡Sigues adelante! 💪\n\n`
    } else if (profile.recent_trend === 'declining') {
      message += `Hoy es una nueva oportunidad para crecer. Te acompaño. 💙\n\n`
    } else {
      message += `Que tengas un día lleno de bendiciones. 🙏\n\n`
    }

    // Añadir versículo apropiado
    if (profile.crisis_risk_level === 'high') {
      message += `📖 "Cercano está Jehová a los quebrantados de corazón" - Salmos 34:18\n\n`
    } else if (profile.recent_trend === 'improving') {
      message += `📖 "Regocijaos en el Señor siempre" - Filipenses 4:4\n\n`
    } else {
      message += `📖 "Este es el día que hizo Jehová; nos gozaremos y alegraremos en él" - Salmos 118:24\n\n`
    }

    message += `¿Cómo amaneces hoy? Me gustaría saber de ti. 💭`

    return message
  }

  private generateAfternoonMessage(profile: UserEmotionalProfile): string {
    let message = `☀️ ¡Hola! ¿Cómo va tu día? `

    if (profile.common_triggers.length > 0) {
      message += `Recuerda que puedes manejar los desafíos que aparezcan. 💪\n\n`
    }

    if (profile.recent_trend === 'stable') {
      message += `Me alegra verte mantener el equilibrio. ¡Sigue así! 🌟\n\n`
    } else if (profile.crisis_risk_level === 'medium') {
      message += `Si necesitas tomar un respiro, está bien. Yo estoy aquí. 🤲\n\n`
    }

    message += `💨 ¿Te gustaría hacer un ejercicio de respiración conmigo?`

    return message
  }

  private generateEveningMessage(profile: UserEmotionalProfile): string {
    let message = `🌙 Es momento de reflexionar sobre tu día. `

    if (profile.recent_trend === 'improving') {
      message += `Celebro tu crecimiento constante. 🎉\n\n`
    } else if (profile.recent_trend === 'declining') {
      message += `Cada día tiene sus desafíos, pero siempre hay esperanza. 💙\n\n`
    }

    // Pregunta reflexiva personalizada
    if (profile.common_emotions.includes('ansiedad')) {
      message += `🤔 ¿Hubo algún momento hoy donde sentiste paz?\n\n`
    } else if (profile.common_emotions.includes('tristeza')) {
      message += `🤔 ¿Qué pequeña cosa buena puedes identificar de hoy?\n\n`
    } else {
      message += `🤔 ¿Cómo viste a Dios obrar en tu día?\n\n`
    }

    message += `🙏 ¿Oramos juntos antes de descansar?`

    return message
  }

  private generateEmergencyMessage(profile: UserEmotionalProfile): string {
    return `🚨 **MENSAJE DE SEGURIDAD**

He notado que podrías estar pasando por un momento muy difícil. Quiero que sepas que:

💙 Tu vida tiene un valor inmenso
💙 No estás solo en esto
💙 Hay ayuda disponible ahora mismo

🆘 **AYUDA INMEDIATA:**
• Crisis: 988
• Emergencias: 911

💬 También puedo ayudarte ahora mismo. ¿Podemos hablar?

Tu bienestar es mi prioridad. Por favor, busca ayuda.`
  }

  private getDefaultTelegramNotifications() {
    return {
      morning: `🌅 ¡Buenos días! Que este nuevo día esté lleno de bendiciones. ¿Cómo te sientes hoy? 💙`,
      afternoon: `☀️ ¿Cómo va tu día? Recuerda tomar pequeños momentos para respirar y agradecer. 🙏`,
      evening: `🌙 Es momento de reflexionar. ¿Qué agradeces de este día? ¿Podemos orar juntos? 💭`,
    }
  }

  private generateDetailedInsights(
    profile: UserEmotionalProfile, 
    avgMood: number, 
    trend: string, 
    recentProgress: EmotionalProgress[]
  ): {
    summary: string
    recommendations: string[]
    encouragement: string
    next_steps: string[]
  } {

    let summary = ""
    let encouragement = ""
    const recommendations: string[] = []
    const nextSteps: string[] = []

    switch (trend) {
      case 'improving':
        summary = `¡Excelente! He notado una clara mejora en tu bienestar emocional. Tu estado de ánimo promedio ha sido ${avgMood.toFixed(1)}/10.`
        encouragement = "Dios está obrando en tu vida. Continúa con las prácticas que te están ayudando."
        recommendations.push("Mantén tus rutinas de oración y reflexión", "Comparte tu testimonio para inspirar a otros")
        nextSteps.push("Continúa con tu rutina actual", "Considera nuevos versículos de gratitud")
        break

      case 'stable':
        summary = `Tu estado emocional se mantiene estable con un promedio de ${avgMood.toFixed(1)}/10. Esto muestra consistencia en tu bienestar.`
        encouragement = "La estabilidad es una gran fortaleza. Dios te sostiene en cada momento."
        recommendations.push("Explora nuevas formas de crecimiento espiritual", "Considera ayudar a otros en su jornada")
        nextSteps.push("Prueba nuevos versículos", "Reflexiona sobre tus metas espirituales")
        break

      case 'declining':
        summary = `He notado algunos desafíos en tu bienestar reciente. Tu promedio ha sido ${avgMood.toFixed(1)}/10, pero esto es temporal.`
        encouragement = "Recuerda que las dificultades son oportunidades para crecer en fe. No estás solo en esto."
        recommendations.push("Enfócate en versículos de esperanza", "Considera aumentar el tiempo de oración", "Busca apoyo en tu comunidad")
        nextSteps.push("Encuentra versículos de fortaleza", "Habla sobre lo que te preocupa")
        break

      case 'crisis':
        summary = "He detectado que estás pasando por un momento muy difícil. Tu bienestar necesita atención inmediata."
        encouragement = "Dios está contigo en el valle más oscuro. Hay esperanza y ayuda disponible."
        recommendations.push("Contacta líneas de crisis si es necesario", "Busca apoyo profesional", "Enfócate en versículos de esperanza inmediata")
        nextSteps.push("Recursos de crisis disponibles", "Conversación de apoyo inmediato")
        break
    }

    return {
      summary,
      recommendations,
      encouragement,
      next_steps: nextSteps
    }
  }

  // Generar notificaciones personalizadas para Telegram
  generateTelegramNotifications(userId: string): {
    morning: string
    afternoon: string
    evening: string
    emergency?: string
  } {
    const profile = this.getUserProfile(userId)
    const insights = this.generatePersonalizedInsights(userId)

    const notifications = {
      morning: "🌅 Buenos días! Que este día esté lleno de las bendiciones de Dios. ¿Cómo amaneciste hoy?",
      afternoon: "☀️ ¿Cómo va tu día? Recuerda que Dios tiene planes de bien para ti.",
      evening: "🌙 Hora de reflexionar. ¿Qué bendiciones puedes agradecer hoy?"
    }

    if (profile) {
      switch (profile.recent_trend) {
        case 'improving':
          notifications.morning = "🌅 ¡Buenos días, guerrero! Sigues avanzando en tu jornada de fe. ¿Cómo te sientes hoy?"
          notifications.afternoon = "☀️ Tu progreso es inspirador. Que Dios siga bendiciendo tu crecimiento. 🙏"
          notifications.evening = "🌙 Agradece por las victorias de hoy. Dios está obrando en tu vida. 💖"
          break

        case 'declining':
          notifications.morning = "🌅 Nuevo día, nuevas oportunidades. Dios renueva tus fuerzas cada mañana. 💪"
          notifications.afternoon = "☀️ Recuerda: 'Todo lo puedo en Cristo que me fortalece.' ¿Necesitas conversarlo?"
          notifications.evening = "🌙 Los días difíciles también tienen propósito. Dios está contigo siempre. 🤗"
          break

        case 'crisis':
          notifications.morning = "🌅 Dios te ama infinitamente. Hay esperanza y ayuda disponible. No estás solo. 💙"
          notifications.afternoon = "☀️ Un paso a la vez. Dios está contigo en cada momento difícil. 🙏"
          notifications.evening = "🌙 'Aun en valle de sombra de muerte, no temeré mal alguno.' Salmos 23:4 💖"
          notifications.emergency = "🚨 Si necesitas ayuda inmediata, contacta: Crisis 988 | Emergencias 911. Dios te ama. 💙"
          break
      }
    }

    return notifications
  }
}

export const emotionalMonitoringService = EmotionalMonitoringService.getInstance()
export type { EmotionalProgress, UserEmotionalProfile }