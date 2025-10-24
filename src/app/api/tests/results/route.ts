import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const testId = searchParams.get('test_id')

    const supabase = createClient()

    let query = supabase
      .from('user_test_results')
      .select(`
        *,
        psychological_tests(
          title,
          category,
          difficulty
        )
      `)
      .eq('user_id', session.user.id)
      .order('completed_at', { ascending: false })
      .limit(limit)

    if (testId) {
      query = query.eq('test_id', testId)
    }

    const { data: results, error } = await query

    if (error) {
      console.error('Error fetching test results:', error)
      return NextResponse.json(
        { error: 'Failed to fetch test results' },
        { status: 500 }
      )
    }

    return NextResponse.json({ results: results || [] })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { test_id, answers, duration_minutes } = body

    // Validar datos requeridos
    if (!test_id || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Obtener información del test
    const { data: test, error: testError } = await supabase
      .from('psychological_tests')
      .select('*')
      .eq('id', test_id)
      .single()

    if (testError || !test) {
      return NextResponse.json(
        { error: 'Test not found' },
        { status: 404 }
      )
    }

    // Procesar respuestas y calcular puntuación
    const testQuestions = JSON.parse(test.questions || '[]')
    const { score, categoryScores, insights, recommendations } = await processTestResults(
      testQuestions,
      answers,
      test.category
    )

    // Guardar resultado
    const { data: result, error } = await supabase
      .from('user_test_results')
      .insert({
        user_id: session.user.id,
        test_id,
        answers: JSON.stringify(answers),
        score,
        category_scores: categoryScores,
        insights,
        recommendations,
        duration_minutes: duration_minutes || null,
        completed_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving test result:', error)
      return NextResponse.json(
        { error: 'Failed to save test result' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      result: {
        ...result,
        test_title: test.title,
        test_category: test.category
      }
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function processTestResults(
  questions: any[],
  answers: any[],
  category: string
): Promise<{
  score: number
  categoryScores: Record<string, number>
  insights: string[]
  recommendations: string[]
}> {
  let totalScore = 0
  let maxScore = 0
  const categoryScores: Record<string, number> = {}
  const categoryMaxScores: Record<string, number> = {}

  // Calcular puntuaciones por categoría
  questions.forEach((question, index) => {
    const answer = answers[index]
    if (!answer) return

    const questionCategory = question.category || 'general'
    const points = calculateQuestionScore(question, answer)
    const maxPoints = getMaxQuestionScore(question)

    totalScore += points
    maxScore += maxPoints

    if (!categoryScores[questionCategory]) {
      categoryScores[questionCategory] = 0
      categoryMaxScores[questionCategory] = 0
    }

    categoryScores[questionCategory] += points
    categoryMaxScores[questionCategory] += maxPoints
  })

  // Normalizar puntuaciones a porcentajes
  const score = Math.round((totalScore / maxScore) * 100)
  
  Object.keys(categoryScores).forEach(cat => {
    categoryScores[cat] = Math.round((categoryScores[cat] / categoryMaxScores[cat]) * 100)
  })

  // Generar insights y recomendaciones basados en los resultados
  const insights = generateInsights(score, categoryScores, category)
  const recommendations = generateRecommendations(score, categoryScores, category)

  return {
    score,
    categoryScores,
    insights,
    recommendations
  }
}

function calculateQuestionScore(question: any, answer: any): number {
  switch (question.type) {
    case 'multiple_choice':
      const option = question.options.find((opt: any) => opt.id === answer.selected)
      return option?.points || 0

    case 'likert_scale':
      // Escala Likert: 1-5 puntos
      return parseInt(answer.value) || 0

    case 'yes_no':
      return answer.value === 'yes' ? (question.positive_scoring ? 5 : 0) : (question.positive_scoring ? 0 : 5)

    case 'slider':
      // Normalizar valor del slider (0-100) a escala 0-5
      return Math.round((parseInt(answer.value) / 100) * 5)

    default:
      return 0
  }
}

function getMaxQuestionScore(question: any): number {
  switch (question.type) {
    case 'multiple_choice':
      return Math.max(...question.options.map((opt: any) => opt.points || 0))
    case 'likert_scale':
    case 'yes_no':
    case 'slider':
      return 5
    default:
      return 5
  }
}

function generateInsights(
  overallScore: number,
  categoryScores: Record<string, number>,
  testCategory: string
): string[] {
  const insights: string[] = []

  // Insight general basado en puntuación total
  if (overallScore >= 80) {
    insights.push(`Excelente: Tu bienestar en esta área está en un nivel muy alto (${overallScore}%). Continúa cultivando estos aspectos positivos.`)
  } else if (overallScore >= 60) {
    insights.push(`Bueno: Tienes una base sólida en esta área (${overallScore}%), con oportunidades específicas de crecimiento.`)
  } else if (overallScore >= 40) {
    insights.push(`En desarrollo: Hay aspectos importantes que puedes fortalecer (${overallScore}%). Considera enfocarte en las áreas de menor puntuación.`)
  } else {
    insights.push(`Área de atención: Esta evaluación sugiere que podrías beneficiarte de apoyo adicional (${overallScore}%). Considera buscar acompañamiento profesional.`)
  }

  // Insights específicos por categoría
  Object.entries(categoryScores).forEach(([category, score]) => {
    if (score >= 80) {
      insights.push(`Fortaleza en ${category}: Esta es claramente un área de fortaleza para ti (${score}%).`)
    } else if (score <= 40) {
      insights.push(`Oportunidad en ${category}: Esta área podría beneficiarse de atención especial (${score}%).`)
    }
  })

  return insights.slice(0, 4) // Limitar a 4 insights principales
}

function generateRecommendations(
  overallScore: number,
  categoryScores: Record<string, number>,
  testCategory: string
): string[] {
  const recommendations: string[] = []

  // Recomendaciones generales según el tipo de test
  switch (testCategory) {
    case 'emotional':
      if (overallScore < 60) {
        recommendations.push('Considera establecer una rutina diaria de oración y meditación para encontrar paz interior.')
        recommendations.push('Busca apoyo en tu comunidad de fe y no dudes en compartir tus cargas con hermanos de confianza.')
      }
      recommendations.push('Practica la gratitud diariamente, recordando las bendiciones de Dios en tu vida.')
      break

    case 'spiritual':
      if (overallScore < 60) {
        recommendations.push('Establece un tiempo consistente para la lectura bíblica y la oración personal.')
        recommendations.push('Únete a un grupo pequeño o estudio bíblico para crecer en comunidad.')
      }
      recommendations.push('Busca oportunidades de servicio para poner en práctica tu fe.')
      break

    case 'personality':
      recommendations.push('Explora cómo Dios puede usar tus dones únicos para servir a otros.')
      recommendations.push('Considera participar en ministerios que alineen con tus fortalezas naturales.')
      break
  }

  // Recomendaciones específicas basadas en categorías débiles
  Object.entries(categoryScores).forEach(([category, score]) => {
    if (score <= 50) {
      switch (category) {
        case 'anxiety':
          recommendations.push('Practica técnicas de respiración y meditación en la Palabra de Dios cuando sientas ansiedad.')
          break
        case 'relationships':
          recommendations.push('Busca sanar relaciones dañadas a través del perdón y la comunicación amorosa.')
          break
        case 'self_esteem':
          recommendations.push('Recuerda tu identidad como hijo/a amado/a de Dios y tu valor inherente en Cristo.')
          break
        case 'prayer':
          recommendations.push('Experimenta con diferentes formas de oración: adoración, petición, intercesión y contemplación.')
          break
        case 'service':
          recommendations.push('Identifica maneras prácticas de servir en tu iglesia local o comunidad.')
          break
      }
    }
  })

  return recommendations.slice(0, 5) // Limitar a 5 recomendaciones principales
}