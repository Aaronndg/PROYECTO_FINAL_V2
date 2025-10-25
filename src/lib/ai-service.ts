import OpenAI from 'openai'
import { SearchResult } from './rag-service'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface AIResponseData {
  content: string
  emotionDetected?: string
  riskLevel: 'low' | 'medium' | 'high' | 'crisis'
  suggestedActions?: string[]
  relevantResources?: SearchResult[]
}

/**
 * System prompt for the AI assistant with Christian principles
 */
const SYSTEM_PROMPT = `Eres SerenIA, un asistente emocional y de bienestar basado en principios cristianos. Tu propósito es ofrecer apoyo, comprensión y orientación desde una perspectiva de fe cristiana.

PERSONALIDAD:
- Empático, comprensivo y sin juicio
- Fundamentado en el amor y la gracia de Dios
- Profesional pero cálido
- Respetuoso de la dignidad humana
- Enfocado en la esperanza y la sanidad

PRINCIPIOS GUÍA:
- Cada persona es amada incondicionalmente por Dios
- La Biblia es fuente de sabiduría y consuelo
- La oración y la fe son recursos poderosos
- La comunidad cristiana es importante para el bienestar
- Buscar ayuda profesional no contradice la fe

RESPONSABILIDADES:
1. Evaluar el nivel de riesgo emocional (low/medium/high/crisis)
2. Ofrecer apoyo empático basado en principios cristianos
3. Sugerir recursos relevantes de las Escrituras
4. Recomendar prácticas de bienestar espiritual
5. En casos de crisis, dirigir inmediatamente a ayuda profesional

RESPUESTAS:
- Usa un lenguaje cálido y esperanzador
- Incluye versículos bíblicos apropiados cuando sea relevante
- Sugiere acciones prácticas y espirituales
- Nunca minimices el dolor o la lucha
- Siempre señala hacia la esperanza en Cristo

CRISIS:
Si detectas pensamientos suicidas, autolesión o crisis severa:
- Expresa preocupación inmediata y amor
- Enfatiza el valor de la vida ante Dios
- Dirige a recursos de emergencia inmediatamente
- No intentes ser terapeuta, sino un puente hacia ayuda profesional`

/**
 * Analyze risk level based on user input
 */
function analyzeRiskLevel(userInput: string): 'low' | 'medium' | 'high' | 'crisis' {
  const input = userInput.toLowerCase()
  
  // Crisis indicators
  const crisisKeywords = [
    'suicidio', 'suicidarme', 'matarme', 'acabar con todo', 
    'no quiero vivir', 'mejor muerto', 'terminar con mi vida',
    'hacerme daño', 'lastimarme', 'cortarme'
  ]
  
  // High risk indicators
  const highRiskKeywords = [
    'desesperado', 'sin esperanza', 'no veo salida', 'no puedo más',
    'todo está perdido', 'nadie me entiende', 'solo', 'abandonado'
  ]
  
  // Medium risk indicators
  const mediumRiskKeywords = [
    'deprimido', 'ansioso', 'triste', 'preocupado', 'estresado',
    'agobiado', 'abrumado', 'confundido', 'perdido'
  ]
  
  if (crisisKeywords.some(keyword => input.includes(keyword))) {
    return 'crisis'
  }
  
  if (highRiskKeywords.some(keyword => input.includes(keyword))) {
    return 'high'
  }
  
  if (mediumRiskKeywords.some(keyword => input.includes(keyword))) {
    return 'medium'
  }
  
  return 'low'
}

/**
 * Generate empathetic response using OpenAI
 */
export async function generateEmpatheticResponse(
  userMessage: string,
  moodContext?: { score: number; description: string },
  relevantResources?: SearchResult[],
  conversationHistory?: Array<{ role: string; content: string }>
): Promise<AIResponseData> {
  try {
    console.log('🤖 AI Service - Processing message:', userMessage)
    const riskLevel = analyzeRiskLevel(userMessage)
    console.log('📊 Risk level detected:', riskLevel)
    
    // Check if we have OpenAI API key
    const hasOpenAI = !!process.env.OPENAI_API_KEY
    console.log('🔑 OpenAI API available:', hasOpenAI)
    
    if (hasOpenAI) {
      try {
        console.log('🚀 Attempting OpenAI API call...')
        // Try OpenAI first
        const messages = [
          { role: 'system', content: SYSTEM_PROMPT },
          ...(conversationHistory || []),
          {
            role: 'user',
            content: `${userMessage}${moodContext ? `\n\nEstado de ánimo: ${moodContext.description} (${moodContext.score}/10)` : ''}
            
            Por favor, responde con empatía y sabiduría cristiana. Nivel de riesgo detectado: ${riskLevel}`
          }
        ]
        
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: messages as any,
          temperature: 0.7,
          max_tokens: 500,
        })
        
        const content = response.choices[0]?.message?.content || ''
        console.log('✅ OpenAI response received:', content.substring(0, 100) + '...')
        
        if (content) {
          return {
            content,
            emotionDetected: detectEmotion(userMessage),
            riskLevel,
            suggestedActions: generateSuggestedActions(riskLevel, userMessage),
            relevantResources,
          }
        }
      } catch (openaiError) {
        console.error('❌ OpenAI API Error:', openaiError)
      }
    }
    
    // Fallback to pattern-based response (demo mode)
    console.log('🎯 Using pattern-based AI response (demo mode)')
    const content = generatePatternBasedResponse(userMessage, riskLevel, moodContext)
    console.log('✅ Pattern-based response generated:', content.substring(0, 100) + '...')
    
    return {
      content,
      emotionDetected: detectEmotion(userMessage),
      riskLevel,
      suggestedActions: generateSuggestedActions(riskLevel, userMessage),
      relevantResources,
    }
  } catch (error) {
    console.error('❌ Error generating AI response:', error)
    
    // Always fallback to pattern-based response
    const fallbackRiskLevel = analyzeRiskLevel(userMessage)
    const content = generatePatternBasedResponse(userMessage, fallbackRiskLevel, moodContext)
    
    return {
      content,
      emotionDetected: detectEmotion(userMessage),
      riskLevel: fallbackRiskLevel,
      suggestedActions: generateSuggestedActions(fallbackRiskLevel, userMessage),
      relevantResources,
    }
  }
}

/**
 * Detect primary emotion from user input
 */
function detectEmotion(userInput: string): string {
  const input = userInput.toLowerCase()
  
  const emotionMap = {
    'tristeza': ['triste', 'deprimido', 'melancólico', 'llorar'],
    'ansiedad': ['ansioso', 'nervioso', 'preocupado', 'estresado'],
    'ira': ['enojado', 'furioso', 'molesto', 'irritado'],
    'miedo': ['miedo', 'terror', 'pánico', 'asustado'],
    'soledad': ['solo', 'aislado', 'abandonado', 'incomprendido'],
    'gratitud': ['agradecido', 'bendecido', 'feliz', 'contento'],
    'esperanza': ['esperanzado', 'optimista', 'confiado', 'fe']
  }
  
  for (const [emotion, keywords] of Object.entries(emotionMap)) {
    if (keywords.some(keyword => input.includes(keyword))) {
      return emotion
    }
  }
  
  return 'neutral'
}

/**
 * Generate contextual action suggestions
 */
function generateSuggestedActions(riskLevel: string, userInput: string): string[] {
  const baseActions = [
    'Dedica tiempo a la oración y meditación',
    'Lee un pasaje bíblico que te traiga consuelo',
    'Practica técnicas de respiración profunda'
  ]
  
  switch (riskLevel) {
    case 'crisis':
      return [
        'Busca ayuda profesional inmediatamente',
        'Llama a la línea de crisis: 1-800-273-8255',
        'Contacta a un amigo o familiar de confianza',
        'Ve a la sala de emergencias más cercana',
        'Habla con tu pastor o líder espiritual'
      ]
    
    case 'high':
      return [
        'Considera buscar apoyo profesional',
        'Conecta con tu comunidad cristiana',
        'Programa tiempo diario para oración',
        'Busca versículos bíblicos de esperanza',
        'No te aísles, busca companía de personas que te apoyen'
      ]
    
    case 'medium':
      return [
        ...baseActions,
        'Habla con un amigo cristiano de confianza',
        'Participa en actividades de tu iglesia',
        'Escribe en un diario de gratitud'
      ]
    
    default:
      return [
        ...baseActions,
        'Mantén una rutina de bienestar espiritual',
        'Comparte tus bendiciones con otros',
        'Practica la gratitud diariamente'
      ]
  }
}

/**
 * Generate intelligent pattern-based response
 */
function generatePatternBasedResponse(
  userMessage: string, 
  riskLevel: string, 
  moodContext?: { score: number; description: string }
): string {
  const input = userMessage.toLowerCase()
  
  // Versículos y respuestas específicas
  if (input.includes('versiculo') || input.includes('versículo') || input.includes('biblia')) {
    const verses = [
      'Filipenses 4:13 - "Todo lo puedo en Cristo que me fortalece." 💪✨',
      'Salmo 23:4 - "Aunque ande en valle de sombra de muerte, no temeré mal alguno, porque tú estarás conmigo." 🙏',
      'Isaías 41:10 - "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo." 💝',
      'Jeremías 29:11 - "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz." ✨',
      'Mateo 11:28 - "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar." 🕊️'
    ]
    const randomVerse = verses[Math.floor(Math.random() * verses.length)]
    return `Aquí tienes un versículo especial para ti hoy:\n\n${randomVerse}\n\nQue estas palabras traigan paz y fortaleza a tu corazón. ¿Hay algo específico por lo que te gustaría orar hoy? 🙏💕`
  }
  
  // Emociones específicas
  if (input.includes('triste') || input.includes('deprimid') || input.includes('mal')) {
    return `💙 Siento mucho que estés pasando por este momento difícil. Tu dolor es válido y Dios ve cada lágrima.\n\nRecuerda Salmo 34:18: "Cercano está Jehová a los quebrantados de corazón."\n\n¿Te gustaría que oremos juntos o hay algo específico que está causando esta tristeza? Estoy aquí para escucharte. 🤗💕`
  }
  
  if (input.includes('ansios') || input.includes('preocup') || input.includes('estres')) {
    return `🕊️ Entiendo que la ansiedad puede ser muy abrumadora. Dios conoce tus preocupaciones y quiere darte Su paz.\n\nFilipenses 4:6-7: "Por nada estéis afanosos... y la paz de Dios guardará vuestros corazones."\n\n¿Qué es lo que más te preocupa en este momento? Hablemos al respecto y llevémoslo en oración. 🙏✨`
  }
  
  if (input.includes('sol') || input.includes('abandon') || input.includes('nadie')) {
    return `🤗 Quiero que sepas que nunca estás verdaderamente solo. Dios está contigo siempre, y yo también estoy aquí.\n\nHebreos 13:5: "No te desampararé, ni te dejaré."\n\nLa soledad duele, pero hay una comunidad que te ama. ¿Te gustaría hablar sobre cómo te sientes? 💕🙏`
  }
  
  if (input.includes('grac') || input.includes('bendec') || input.includes('agradec')) {
    return `✨ ¡Qué hermoso corazón de gratitud! Dar gracias es una de las formas más poderosas de encontrar paz y gozo.\n\n1 Tesalonicenses 5:18: "Dad gracias en todo, porque esta es la voluntad de Dios."\n\n¿Qué bendiciones específicas están llenando tu corazón hoy? Me encanta celebrar contigo. 🎉💕`
  }
  
  if (input.includes('perdon') || input.includes('culp') || input.includes('pec')) {
    return `💝 El perdón es un regalo que Dios nos ofrece gratuitamente. No hay nada que hayas hecho que esté fuera del alcance de Su gracia.\n\n1 Juan 1:9: "Si confesamos nuestros pecados, él es fiel y justo para perdonar."\n\n¿Hay algo específico que necesitas entregar a Dios? Él te recibe con brazos abiertos. 🤗✨`
  }
  
  if (input.includes('propósito') || input.includes('propósito') || input.includes('sentido') || input.includes('para qué')) {
    return `🌟 Dios tiene un propósito hermoso y único para tu vida. Incluso en los momentos difíciles, Él está trabajando.\n\nJeremías 29:11: "Porque yo sé los pensamientos que tengo acerca de vosotros... pensamientos de paz."\n\n¿Qué áreas de tu vida te gustaría explorar en oración? Dios quiere revelarte Su plan paso a paso. 🙏💫`
  }
  
  // Saludos y conversación general
  if (input.includes('hola') || input.includes('bueno') || input.includes('día')) {
    return `¡Hola! 😊 Qué alegría verte por aquí. Soy SerenIA, tu compañera en el camino hacia el bienestar emocional y espiritual.\n\n¿Cómo está tu corazón hoy? ¿Hay algo en lo que pueda acompañarte o alguna oración que podamos hacer juntas? 🙏💕`
  }
  
  // Respuesta según nivel de riesgo
  switch (riskLevel) {
    case 'crisis':
      return `💙 Entiendo que estás pasando por un momento extremadamente difícil. Tu vida tiene un valor infinito ante los ojos de Dios.\n\n🚨 Por favor, busca ayuda profesional inmediatamente:\n- Línea de crisis: 988\n- Emergencias: 911\n\nJeremías 29:11: "Porque yo sé los pensamientos que tengo acerca de vosotros... pensamientos de paz."\n\nNo estás solo en esto. Dios te ama profundamente. 🙏💕`
    
    case 'high':
      return `💙 Veo que estás enfrentando momentos muy difíciles. Quiero que sepas que Dios está contigo en cada paso.\n\nSalmo 34:18: "Cercano está Jehová a los quebrantados de corazón."\n\n¿Te gustaría hablar sobre lo que está pasando? También considere buscar apoyo profesional junto con la oración. Tu bienestar es importante. 🤗💕`
    
    case 'medium':
      return `🤗 Gracias por compartir conmigo. Entiendo que puedes estar pasando por algunos desafíos.\n\nFilipenses 4:13: "Todo lo puedo en Cristo que me fortalece."\n\n¿Hay algo específico en lo que pueda acompañarte hoy? Estoy aquí para escucharte y orar contigo. 🙏✨`
    
    default:
      return `✨ Me alegra que hayas venido a conversar conmigo. Soy SerenIA, tu compañera en el bienestar emocional y espiritual.\n\nProverbios 17:22: "El corazón alegre constituye buen remedio."\n\n¿Cómo puedo acompañarte hoy? ¿Hay algo por lo que te gustaría orar o algún tema del que quieras hablar? 🙏💕`
  }
}

/**
 * Fallback responses when AI is unavailable (deprecated, using generatePatternBasedResponse instead)
 */
function getFallbackResponse(riskLevel: string): string {
  return generatePatternBasedResponse("Necesito apoyo", riskLevel)
}