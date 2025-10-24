'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Navigation } from '@/components/Navigation'
import { 
  TestTube, 
  Heart, 
  Brain, 
  Star, 
  Clock, 
  ArrowRight,
  CheckCircle,
  BarChart3,
  Trophy,
  Target,
  Users
} from 'lucide-react'

interface Test {
  id: string
  title: string
  description: string
  category: 'emotional' | 'spiritual' | 'personality'
  duration: number // en minutos
  questions_count: number
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
  is_completed?: boolean
  last_score?: number
  created_at: string
}

interface TestResult {
  id: string
  test_id: string
  score: number
  category_scores: Record<string, number>
  insights: string[]
  recommendations: string[]
  completed_at: string
}

export default function TestsPage() {
  const { data: session } = useSession()
  const [tests, setTests] = useState<Test[]>([])
  const [recentResults, setRecentResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { value: 'all', label: 'Todos', icon: TestTube, color: 'text-serenia-500' },
    { value: 'emotional', label: 'Bienestar Emocional', icon: Heart, color: 'text-red-500' },
    { value: 'spiritual', label: 'Crecimiento Espiritual', icon: Star, color: 'text-yellow-500' },
    { value: 'personality', label: 'Personalidad Cristiana', icon: Brain, color: 'text-blue-500' }
  ]

  const availableTests: Test[] = [
    {
      id: 'emotional-wellness',
      title: 'Evaluación de Bienestar Emocional',
      description: 'Evalúa tu estado emocional actual y recibe recomendaciones personalizadas para mejorar tu bienestar mental y espiritual.',
      category: 'emotional',
      duration: 15,
      questions_count: 25,
      difficulty: 'medium',
      tags: ['ansiedad', 'depresión', 'estrés', 'autoestima', 'relaciones'],
      created_at: new Date().toISOString()
    },
    {
      id: 'spiritual-maturity',
      title: 'Test de Madurez Espiritual',
      description: 'Descubre tu nivel de crecimiento espiritual y áreas donde puedes profundizar tu relación con Dios.',
      category: 'spiritual',
      duration: 20,
      questions_count: 30,
      difficulty: 'medium',
      tags: ['fe', 'oración', 'servicio', 'lectura bíblica', 'comunidad'],
      created_at: new Date().toISOString()
    },
    {
      id: 'personality-strengths',
      title: 'Fortalezas de Personalidad Cristiana',
      description: 'Identifica tus dones espirituales únicos y cómo Dios te ha equipado para servir en Su reino.',
      category: 'personality',
      duration: 25,
      questions_count: 40,
      difficulty: 'hard',
      tags: ['dones', 'talentos', 'servicio', 'liderazgo', 'ministerio'],
      created_at: new Date().toISOString()
    },
    {
      id: 'anxiety-assessment',
      title: 'Evaluación de Ansiedad y Estrés',
      description: 'Mide tus niveles de ansiedad y estrés, y recibe estrategias basadas en principios bíblicos para encontrar paz.',
      category: 'emotional',
      duration: 10,
      questions_count: 18,
      difficulty: 'easy',
      tags: ['ansiedad', 'estrés', 'paz', 'confianza', 'descanso'],
      created_at: new Date().toISOString()
    },
    {
      id: 'prayer-life',
      title: 'Evaluación de Vida de Oración',
      description: 'Analiza tu relación con Dios a través de la oración y descubre maneras de profundizar tu conexión espiritual.',
      category: 'spiritual',
      duration: 12,
      questions_count: 20,
      difficulty: 'easy',
      tags: ['oración', 'intimidad', 'comunicación', 'adoración', 'meditación'],
      created_at: new Date().toISOString()
    },
    {
      id: 'relationship-health',
      title: 'Salud en las Relaciones',
      description: 'Evalúa la calidad de tus relaciones interpersonales desde una perspectiva cristiana de amor y perdón.',
      category: 'emotional',
      duration: 18,
      questions_count: 28,
      difficulty: 'medium',
      tags: ['relaciones', 'amor', 'perdón', 'comunicación', 'conflicto'],
      created_at: new Date().toISOString()
    }
  ]

  useEffect(() => {
    loadTests()
    if (session) {
      loadRecentResults()
    }
  }, [session])

  const loadTests = async () => {
    try {
      // Simular carga de tests con datos estáticos por ahora
      setTests(availableTests)
    } catch (error) {
      console.error('Error loading tests:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadRecentResults = async () => {
    if (!session?.user?.id) return
    
    try {
      const response = await fetch('/api/tests/results')
      if (response.ok) {
        const data = await response.json()
        setRecentResults(data.results || [])
      }
    } catch (error) {
      console.error('Error loading test results:', error)
    }
  }

  const startTest = (testId: string) => {
    if (session) {
      window.location.href = `/tests/${testId}`
    } else {
      window.location.href = '/auth/signin'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil'
      case 'medium': return 'Intermedio'
      case 'hard': return 'Avanzado'
      default: return 'Normal'
    }
  }

  const filteredTests = selectedCategory === 'all' 
    ? tests 
    : tests.filter(test => test.category === selectedCategory)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-serenia-600 mx-auto mb-4"></div>
              <p className="text-serenity-600">Cargando evaluaciones...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <TestTube className="w-12 h-12 text-serenia-500 mr-3" />
            <h1 className="text-4xl font-bold text-serenia-800">Evaluaciones Espirituales</h1>
          </div>
          <p className="text-xl text-serenity-600 max-w-3xl mx-auto">
            Descubre tu crecimiento personal y espiritual a través de evaluaciones diseñadas 
            para ayudarte en tu camino de fe y bienestar
          </p>
        </div>

        {/* Stats Section for Authenticated Users */}
        {session && recentResults.length > 0 && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-serenity-800">{recentResults.length}</p>
                  <p className="text-sm text-serenity-600">Tests Completados</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <BarChart3 className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-serenity-800">
                    {Math.round(recentResults.reduce((acc, r) => acc + r.score, 0) / recentResults.length)}%
                  </p>
                  <p className="text-sm text-serenity-600">Puntuación Promedio</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-serenity-800">
                    {recentResults.filter(r => r.score >= 80).length}
                  </p>
                  <p className="text-sm text-serenity-600">Resultados Excelentes</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-serenity-800">
                    {new Date(recentResults[0]?.completed_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-serenity-600">Último Test</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-serenity-800 mb-4">Categorías de Evaluación</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedCategory === category.value
                      ? 'border-serenia-500 bg-serenia-50'
                      : 'border-serenity-200 bg-white hover:border-serenia-300'
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${category.color}`} />
                  <p className="font-medium text-serenity-800">{category.label}</p>
                  <p className="text-sm text-serenity-600">
                    {tests.filter(t => category.value === 'all' || t.category === category.value).length} tests
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tests Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => {
            const categoryInfo = categories.find(c => c.value === test.category)
            const CategoryIcon = categoryInfo?.icon || TestTube
            
            return (
              <div key={test.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <CategoryIcon className={`w-8 h-8 mr-3 ${categoryInfo?.color || 'text-serenia-500'}`} />
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(test.difficulty)}`}>
                          {getDifficultyLabel(test.difficulty)}
                        </span>
                      </div>
                    </div>
                    {test.is_completed && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-serenity-800 mb-3">
                    {test.title}
                  </h3>
                  
                  <p className="text-serenity-600 text-sm leading-relaxed mb-4">
                    {test.description}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-sm text-serenity-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{test.duration} min</span>
                    </div>
                    <div className="flex items-center">
                      <TestTube className="w-4 h-4 mr-1" />
                      <span>{test.questions_count} preguntas</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {test.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-serenia-100 text-serenia-700 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {test.tags.length > 3 && (
                      <span className="px-2 py-1 bg-serenity-100 text-serenity-600 rounded-full text-xs">
                        +{test.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Last Score */}
                  {test.last_score && (
                    <div className="bg-serenia-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-serenia-700">
                        Última puntuación: <span className="font-semibold">{test.last_score}%</span>
                      </p>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => startTest(test.id)}
                    className="w-full bg-serenia-600 text-white py-3 rounded-lg font-medium hover:bg-serenia-700 transition-colors flex items-center justify-center"
                  >
                    {test.is_completed ? 'Repetir Test' : 'Comenzar Test'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredTests.length === 0 && (
          <div className="text-center py-12">
            <TestTube className="w-16 h-16 text-serenity-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-serenity-600 mb-2">
              No hay tests disponibles
            </h3>
            <p className="text-serenity-500">
              No se encontraron evaluaciones en esta categoría
            </p>
          </div>
        )}

        {/* Call to Action for Non-Authenticated Users */}
        {!session && (
          <div className="bg-gradient-to-r from-serenia-600 to-serenia-700 rounded-xl p-8 text-center text-white mt-12">
            <h2 className="text-2xl font-bold mb-4">
              Inicia sesión para guardar tus resultados
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Regístrate gratis para acceder a todas las evaluaciones y llevar un seguimiento de tu progreso espiritual
            </p>
            <button
              onClick={() => window.location.href = '/auth/signin'}
              className="bg-white text-serenia-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              Crear cuenta gratis
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}

        {/* Recent Results Section */}
        {session && recentResults.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-serenia-800 mb-6">
              Resultados Recientes
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {recentResults.slice(0, 4).map((result) => {
                const test = tests.find(t => t.id === result.test_id)
                return (
                  <div key={result.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-serenity-800">
                        {test?.title || 'Test Completado'}
                      </h3>
                      <span className="text-2xl font-bold text-serenia-600">
                        {result.score}%
                      </span>
                    </div>
                    <p className="text-sm text-serenity-600 mb-3">
                      Completado el {new Date(result.completed_at).toLocaleDateString()}
                    </p>
                    {result.insights.length > 0 && (
                      <div className="bg-serenity-50 rounded-lg p-3">
                        <p className="text-sm text-serenity-700">
                          <strong>Insight principal:</strong> {result.insights[0]}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}