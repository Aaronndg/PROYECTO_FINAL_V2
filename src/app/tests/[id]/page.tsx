'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Heart,
  Star,
  Brain,
  Target,
  Lightbulb
} from 'lucide-react'

interface Question {
  id: string
  text: string
  type: 'multiple_choice' | 'likert_scale' | 'yes_no' | 'slider'
  category?: string
  options?: Array<{
    id: string
    text: string
    points: number
  }>
  min_value?: number
  max_value?: number
  positive_scoring?: boolean
}

interface Test {
  id: string
  title: string
  description: string
  category: 'emotional' | 'spiritual' | 'personality'
  duration: number
  questions: Question[]
  instructions?: string
}

interface Answer {
  question_id: string
  selected?: string
  value?: string
  timestamp: number
}

interface TestResult {
  score: number
  category_scores: Record<string, number>
  insights: string[]
  recommendations: string[]
}

export default function TestPage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const testId = params.id as string

  const [test, setTest] = useState<Test | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<TestResult | null>(null)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)

  // Definir tests estáticos para demo
  const staticTests: Record<string, Test> = {
    'emotional-wellness': {
      id: 'emotional-wellness',
      title: 'Evaluación de Bienestar Emocional',
      description: 'Evalúa tu estado emocional actual y recibe recomendaciones personalizadas.',
      category: 'emotional',
      duration: 15,
      instructions: 'Responde honestamente a cada pregunta. No hay respuestas correctas o incorrectas.',
      questions: [
        {
          id: 'q1',
          text: '¿Con qué frecuencia te sientes abrumado(a) por las responsabilidades diarias?',
          type: 'likert_scale',
          category: 'stress'
        },
        {
          id: 'q2',
          text: '¿Qué tan fácil te resulta encontrar momentos de paz y tranquilidad?',
          type: 'likert_scale',
          category: 'peace'
        },
        {
          id: 'q3',
          text: 'Cuando enfrentas dificultades, ¿confías en que Dios tiene un propósito?',
          type: 'multiple_choice',
          category: 'faith',
          options: [
            { id: 'always', text: 'Siempre', points: 5 },
            { id: 'usually', text: 'Usualmente', points: 4 },
            { id: 'sometimes', text: 'A veces', points: 3 },
            { id: 'rarely', text: 'Raramente', points: 2 },
            { id: 'never', text: 'Nunca', points: 1 }
          ]
        },
        {
          id: 'q4',
          text: '¿Sientes que tienes un buen equilibrio entre trabajo, familia y tiempo personal?',
          type: 'yes_no',
          category: 'balance',
          positive_scoring: true
        },
        {
          id: 'q5',
          text: 'En una escala del 1 al 100, ¿qué tan satisfecho(a) te sientes con tu vida actual?',
          type: 'slider',
          category: 'satisfaction',
          min_value: 1,
          max_value: 100
        }
      ]
    },
    'spiritual-maturity': {
      id: 'spiritual-maturity',
      title: 'Test de Madurez Espiritual',
      description: 'Descubre tu nivel de crecimiento espiritual y áreas de mejora.',
      category: 'spiritual',
      duration: 20,
      instructions: 'Reflexiona cuidadosamente sobre cada pregunta y responde según tu experiencia actual.',
      questions: [
        {
          id: 'q1',
          text: '¿Con qué frecuencia lees la Biblia y meditas en su contenido?',
          type: 'multiple_choice',
          category: 'bible_study',
          options: [
            { id: 'daily', text: 'Diariamente', points: 5 },
            { id: 'several_week', text: 'Varias veces por semana', points: 4 },
            { id: 'weekly', text: 'Semanalmente', points: 3 },
            { id: 'monthly', text: 'Mensualmente', points: 2 },
            { id: 'rarely', text: 'Raramente', points: 1 }
          ]
        },
        {
          id: 'q2',
          text: '¿Qué tan consistente es tu vida de oración?',
          type: 'likert_scale',
          category: 'prayer'
        },
        {
          id: 'q3',
          text: '¿Buscas activamente oportunidades para servir a otros?',
          type: 'yes_no',
          category: 'service',
          positive_scoring: true
        },
        {
          id: 'q4',
          text: 'En una escala del 1 al 100, ¿qué tan cerca te sientes de Dios en este momento?',
          type: 'slider',
          category: 'intimacy',
          min_value: 1,
          max_value: 100
        }
      ]
    },
    'anxiety-assessment': {
      id: 'anxiety-assessment',
      title: 'Evaluación de Ansiedad y Estrés',
      description: 'Mide tus niveles de ansiedad y estrés para recibir apoyo específico.',
      category: 'emotional',
      duration: 10,
      instructions: 'Piensa en las últimas dos semanas al responder estas preguntas.',
      questions: [
        {
          id: 'q1',
          text: '¿Con qué frecuencia te sientes nervioso(a) o ansioso(a)?',
          type: 'likert_scale',
          category: 'anxiety'
        },
        {
          id: 'q2',
          text: '¿Te resulta difícil relajarte o descansar tu mente?',
          type: 'likert_scale',
          category: 'restlessness'
        },
        {
          id: 'q3',
          text: '¿Has experimentado síntomas físicos como sudoración, palpitaciones o tensión muscular?',
          type: 'yes_no',
          category: 'physical_symptoms',
          positive_scoring: false
        },
        {
          id: 'q4',
          text: 'En una escala del 1 al 100, ¿qué tan seguro(a) te sientes acerca del futuro?',
          type: 'slider',
          category: 'security',
          min_value: 1,
          max_value: 100
        }
      ]
    }
  }

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    loadTest()
  }, [session, testId])

  useEffect(() => {
    if (test && timeRemaining === null) {
      setTimeRemaining(test.duration * 60) // Convertir minutos a segundos
    }
  }, [test])

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0) {
      handleAutoSubmit()
    }
  }, [timeRemaining])

  const loadTest = () => {
    try {
      const testData = staticTests[testId]
      if (testData) {
        setTest(testData)
        setStartTime(Date.now())
      } else {
        router.push('/tests')
      }
    } catch (error) {
      console.error('Error loading test:', error)
      router.push('/tests')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (questionId: string, answer: Partial<Answer>) => {
    const updatedAnswers = answers.filter(a => a.question_id !== questionId)
    updatedAnswers.push({
      question_id: questionId,
      ...answer,
      timestamp: Date.now()
    })
    setAnswers(updatedAnswers)
  }

  const isQuestionAnswered = (questionId: string): boolean => {
    return answers.some(a => a.question_id === questionId && (a.selected || a.value))
  }

  const canProceed = (): boolean => {
    if (!test) return false
    return isQuestionAnswered(test.questions[currentQuestion].id)
  }

  const nextQuestion = () => {
    if (!test) return
    
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmit()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    if (!test || !session?.user?.id) return

    setSubmitting(true)
    try {
      const durationMinutes = Math.floor((Date.now() - startTime) / 60000)
      
      const response = await fetch('/api/tests/results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          test_id: test.id,
          answers: answers,
          duration_minutes: durationMinutes
        })
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data.result)
      } else {
        throw new Error('Failed to submit test')
      }
    } catch (error) {
      console.error('Error submitting test:', error)
      alert('Error al enviar el test. Por favor, inténtalo de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAutoSubmit = () => {
    if (!submitting && !result) {
      handleSubmit()
    }
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const renderQuestion = (question: Question) => {
    const currentAnswer = answers.find(a => a.question_id === question.id)

    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(question.id, { selected: option.id })}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  currentAnswer?.selected === option.id
                    ? 'border-serenia-500 bg-serenia-50'
                    : 'border-serenity-200 bg-white hover:border-serenia-300'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    currentAnswer?.selected === option.id
                      ? 'border-serenia-500 bg-serenia-500'
                      : 'border-serenity-300'
                  }`} />
                  <span className="text-serenity-800">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        )

      case 'likert_scale':
        const scaleLabels = ['Nunca', 'Raramente', 'A veces', 'Frecuentemente', 'Siempre']
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-serenity-600">
              <span>Nunca</span>
              <span>Siempre</span>
            </div>
            <div className="flex justify-between space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleAnswer(question.id, { value: value.toString() })}
                  className={`flex-1 py-3 rounded-lg border-2 transition-all ${
                    currentAnswer?.value === value.toString()
                      ? 'border-serenia-500 bg-serenia-500 text-white'
                      : 'border-serenity-200 bg-white hover:border-serenia-300 text-serenity-700'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-serenity-500">
              {scaleLabels.map((label, index) => (
                <span key={index} className="text-center flex-1">{label}</span>
              ))}
            </div>
          </div>
        )

      case 'yes_no':
        return (
          <div className="flex space-x-4">
            <button
              onClick={() => handleAnswer(question.id, { value: 'yes' })}
              className={`flex-1 py-4 rounded-lg border-2 transition-all ${
                currentAnswer?.value === 'yes'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-serenity-200 bg-white hover:border-green-300'
              }`}
            >
              Sí
            </button>
            <button
              onClick={() => handleAnswer(question.id, { value: 'no' })}
              className={`flex-1 py-4 rounded-lg border-2 transition-all ${
                currentAnswer?.value === 'no'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-serenity-200 bg-white hover:border-red-300'
              }`}
            >
              No
            </button>
          </div>
        )

      case 'slider':
        const sliderValue = parseInt(currentAnswer?.value || '50')
        return (
          <div className="space-y-4">
            <div className="px-4">
              <input
                type="range"
                min={question.min_value || 1}
                max={question.max_value || 100}
                value={sliderValue}
                onChange={(e) => handleAnswer(question.id, { value: e.target.value })}
                className="w-full h-2 bg-serenity-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-serenia-600">{sliderValue}</span>
              <p className="text-sm text-serenity-600">
                {question.min_value || 1} - {question.max_value || 100}
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-serenia-600 mx-auto mb-4"></div>
              <p className="text-serenity-600">Cargando evaluación...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-serenity-800 mb-2">Test no encontrado</h1>
            <p className="text-serenity-600 mb-6">El test que buscas no existe o no está disponible.</p>
            <button
              onClick={() => router.push('/tests')}
              className="bg-serenia-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-serenia-700 transition-colors"
            >
              Volver a Tests
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-serenia-800 mb-2">¡Test Completado!</h1>
            <p className="text-xl text-serenity-600">{test.title}</p>
          </div>

          {/* Score */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-serenia-100 rounded-full mb-4">
                <span className="text-3xl font-bold text-serenia-600">{result.score}%</span>
              </div>
              <h2 className="text-2xl font-bold text-serenity-800 mb-2">Tu Puntuación</h2>
              <div className="w-full bg-serenity-200 rounded-full h-4">
                <div 
                  className="bg-serenia-500 h-4 rounded-full transition-all duration-1000"
                  style={{ width: `${result.score}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Category Scores */}
          {Object.keys(result.category_scores).length > 1 && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h3 className="text-xl font-bold text-serenity-800 mb-6 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2" />
                Puntuaciones por Categoría
              </h3>
              <div className="space-y-4">
                {Object.entries(result.category_scores).map(([category, score]) => (
                  <div key={category}>
                    <div className="flex justify-between mb-2">
                      <span className="text-serenity-700 capitalize">{category.replace('_', ' ')}</span>
                      <span className="font-semibold text-serenia-600">{score}%</span>
                    </div>
                    <div className="w-full bg-serenity-200 rounded-full h-3">
                      <div 
                        className="bg-serenia-400 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insights */}
          {result.insights.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h3 className="text-xl font-bold text-serenity-800 mb-6 flex items-center">
                <Lightbulb className="w-6 h-6 mr-2" />
                Insights Personalizados
              </h3>
              <div className="space-y-4">
                {result.insights.map((insight, index) => (
                  <div key={index} className="bg-serenia-50 rounded-lg p-4">
                    <p className="text-serenity-700 leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h3 className="text-xl font-bold text-serenity-800 mb-6 flex items-center">
                <Target className="w-6 h-6 mr-2" />
                Recomendaciones para tu Crecimiento
              </h3>
              <div className="space-y-3">
                {result.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-6 h-6 bg-serenia-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-serenity-700 leading-relaxed">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push('/tests')}
              className="flex-1 bg-serenity-600 text-white py-3 rounded-lg font-medium hover:bg-serenity-700 transition-colors"
            >
              Explorar Más Tests
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex-1 bg-serenia-600 text-white py-3 rounded-lg font-medium hover:bg-serenia-700 transition-colors"
            >
              Ver Mi Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const progress = ((currentQuestion + 1) / test.questions.length) * 100
  const currentQ = test.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/tests')}
              className="flex items-center text-serenity-600 hover:text-serenia-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver a Tests
            </button>
            {timeRemaining !== null && (
              <div className="flex items-center text-serenity-600">
                <Clock className="w-5 h-5 mr-2" />
                <span className={`font-mono ${timeRemaining < 300 ? 'text-red-600' : ''}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-serenia-800 mb-2">{test.title}</h1>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-serenity-600 mb-2">
              <span>Pregunta {currentQuestion + 1} de {test.questions.length}</span>
              <span>{Math.round(progress)}% completado</span>
            </div>
            <div className="w-full bg-serenity-200 rounded-full h-2">
              <div 
                className="bg-serenia-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {currentQuestion === 0 && test.instructions && (
            <div className="bg-serenia-50 rounded-lg p-4 border border-serenia-200">
              <p className="text-serenia-700">{test.instructions}</p>
            </div>
          )}
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-serenity-800 mb-6 leading-relaxed">
            {currentQ.text}
          </h2>
          
          {renderQuestion(currentQ)}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              currentQuestion === 0
                ? 'bg-serenity-200 text-serenity-400 cursor-not-allowed'
                : 'bg-serenity-600 text-white hover:bg-serenity-700'
            }`}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Anterior
          </button>

          <button
            onClick={nextQuestion}
            disabled={!canProceed() || submitting}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              !canProceed() || submitting
                ? 'bg-serenity-200 text-serenity-400 cursor-not-allowed'
                : 'bg-serenia-600 text-white hover:bg-serenia-700'
            }`}
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Enviando...
              </>
            ) : currentQuestion === test.questions.length - 1 ? (
              <>
                Finalizar Test
                <CheckCircle className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Siguiente
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}