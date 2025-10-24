'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Navigation } from '@/components/Navigation'
import {
  BarChart3,
  Calendar,
  Heart,
  Star,
  TrendingUp,
  BookOpen,
  Brain,
  Target,
  Trophy,
  Clock,
  CheckCircle,
  ArrowRight,
  Flame,
  Users,
  MessageCircle,
  Gift,
  Sun,
  Moon
} from 'lucide-react'

interface DashboardStats {
  total_tests: number
  avg_score: number
  tests_this_week: number
  favorite_verses: number
  days_active: number
  current_streak: number
  last_activity: string
  spiritual_growth_trend: number
  emotional_wellness_trend: number
}

interface RecentActivity {
  id: string
  type: 'test' | 'verse' | 'chat' | 'mood'
  title: string
  description: string
  score?: number
  timestamp: string
}

interface WeeklyProgress {
  day: string
  tests_completed: number
  mood_average: number
  verses_read: number
  chat_sessions: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    
    if (status === 'unauthenticated') {
      window.location.href = '/auth/signin'
      return
    }

    if (session?.user) {
      loadDashboardData()
      setGreeting(getTimeBasedGreeting())
    }
  }, [session, status])

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours()
    const name = session?.user?.name?.split(' ')[0] || 'Hermano/a'
    
    if (hour < 12) {
      return `Buenos días, ${name} ☀️`
    } else if (hour < 18) {
      return `Buenas tardes, ${name} 🌤️`
    } else {
      return `Buenas noches, ${name} 🌙`
    }
  }

  const loadDashboardData = async () => {
    try {
      // Simular datos del dashboard para demo
      const mockStats: DashboardStats = {
        total_tests: 8,
        avg_score: 78,
        tests_this_week: 3,
        favorite_verses: 12,
        days_active: 45,
        current_streak: 7,
        last_activity: new Date().toISOString(),
        spiritual_growth_trend: 15,
        emotional_wellness_trend: 8
      }

      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          type: 'test',
          title: 'Evaluación de Bienestar Emocional',
          description: 'Completaste una evaluación y obtuviste 85%',
          score: 85,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          type: 'verse',
          title: 'Versículo Diario',
          description: 'Leíste y marcaste como favorito Filipenses 4:13',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          type: 'chat',
          title: 'Sesión de Chat',
          description: 'Conversaste sobre manejo de la ansiedad',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '4',
          type: 'test',
          title: 'Test de Madurez Espiritual',
          description: 'Completaste una evaluación y obtuviste 72%',
          score: 72,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]

      const mockWeekly: WeeklyProgress[] = [
        { day: 'Lun', tests_completed: 1, mood_average: 7, verses_read: 3, chat_sessions: 2 },
        { day: 'Mar', tests_completed: 0, mood_average: 6, verses_read: 2, chat_sessions: 1 },
        { day: 'Mié', tests_completed: 2, mood_average: 8, verses_read: 4, chat_sessions: 3 },
        { day: 'Jue', tests_completed: 1, mood_average: 7, verses_read: 2, chat_sessions: 1 },
        { day: 'Vie', tests_completed: 0, mood_average: 6, verses_read: 1, chat_sessions: 0 },
        { day: 'Sáb', tests_completed: 1, mood_average: 8, verses_read: 5, chat_sessions: 2 },
        { day: 'Dom', tests_completed: 0, mood_average: 9, verses_read: 3, chat_sessions: 1 }
      ]

      setStats(mockStats)
      setRecentActivity(mockActivity)
      setWeeklyProgress(mockWeekly)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'test': return Brain
      case 'verse': return BookOpen
      case 'chat': return MessageCircle
      case 'mood': return Heart
      default: return Target
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'test': return 'text-blue-500 bg-blue-100'
      case 'verse': return 'text-green-500 bg-green-100'
      case 'chat': return 'text-purple-500 bg-purple-100'
      case 'mood': return 'text-pink-500 bg-pink-100'
      default: return 'text-gray-500 bg-gray-100'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Hace unos minutos'
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-serenia-600 mx-auto mb-4"></div>
              <p className="text-serenity-600">Cargando tu dashboard...</p>
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-serenia-800 mb-2">{greeting}</h1>
          <p className="text-xl text-serenity-600">
            Tu jornada espiritual continúa. Aquí tienes tu progreso reciente.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-serenia-600">{stats?.total_tests}</p>
                <p className="text-sm text-serenity-600">Tests Completados</p>
              </div>
              <Brain className="w-8 h-8 text-serenia-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-serenia-600">{stats?.avg_score}%</p>
                <p className="text-sm text-serenity-600">Puntuación Promedio</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-serenia-600">{stats?.current_streak}</p>
                <p className="text-sm text-serenity-600">Días Consecutivos</p>
              </div>
              <Flame className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-serenia-600">{stats?.favorite_verses}</p>
                <p className="text-sm text-serenity-600">Versículos Favoritos</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Progress Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Spiritual Growth Trend */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-serenity-800">Crecimiento Espiritual</h3>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="text-3xl font-bold text-green-600">+{stats?.spiritual_growth_trend}%</span>
                  <span className="ml-2 text-sm text-serenity-600">este mes</span>
                </div>
                <div className="w-full bg-serenity-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: '75%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Emotional Wellness */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-serenity-800">Bienestar Emocional</h3>
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="text-3xl font-bold text-blue-600">+{stats?.emotional_wellness_trend}%</span>
                  <span className="ml-2 text-sm text-serenity-600">este mes</span>
                </div>
                <div className="w-full bg-serenity-200 rounded-full h-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: '68%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Progress Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-serenity-800 mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2" />
            Progreso Semanal
          </h3>
          <div className="grid grid-cols-7 gap-4">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="text-center">
                <div className="mb-2">
                  <div 
                    className="bg-serenia-500 rounded-t mx-auto transition-all duration-500"
                    style={{ 
                      width: '24px',
                      height: `${Math.max(day.tests_completed * 20, 4)}px`
                    }}
                  ></div>
                  <div 
                    className="bg-blue-400 mx-auto transition-all duration-500"
                    style={{ 
                      width: '24px',
                      height: `${Math.max(day.mood_average * 5, 4)}px`
                    }}
                  ></div>
                  <div 
                    className="bg-green-400 rounded-b mx-auto transition-all duration-500"
                    style={{ 
                      width: '24px',
                      height: `${Math.max(day.verses_read * 8, 4)}px`
                    }}
                  ></div>
                </div>
                <p className="text-xs text-serenity-600 font-medium">{day.day}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-6 mt-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-serenia-500 rounded mr-1"></div>
              <span className="text-serenity-600">Tests</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-400 rounded mr-1"></div>
              <span className="text-serenity-600">Estado de Ánimo</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded mr-1"></div>
              <span className="text-serenity-600">Versículos</span>
            </div>
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-serenity-800 mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-2" />
              Actividad Reciente
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = getActivityIcon(activity.type)
                const colorClass = getActivityColor(activity.type)
                
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${colorClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-serenity-800">{activity.title}</p>
                      <p className="text-sm text-serenity-600">{activity.description}</p>
                      <p className="text-xs text-serenity-500 mt-1">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                    {activity.score && (
                      <div className="text-right">
                        <span className="text-lg font-bold text-serenia-600">{activity.score}%</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-serenity-800 mb-6 flex items-center">
              <Target className="w-6 h-6 mr-2" />
              Acciones Rápidas
            </h3>
            <div className="space-y-4">
              <button
                onClick={() => window.location.href = '/tests'}
                className="w-full flex items-center justify-between p-4 bg-serenia-50 rounded-lg hover:bg-serenia-100 transition-colors"
              >
                <div className="flex items-center">
                  <Brain className="w-6 h-6 text-serenia-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-serenity-800">Realizar Test</p>
                    <p className="text-sm text-serenity-600">Evalúa tu progreso espiritual</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-serenia-600" />
              </button>

              <button
                onClick={() => window.location.href = '/verses'}
                className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center">
                  <BookOpen className="w-6 h-6 text-green-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-serenity-800">Leer Versículos</p>
                    <p className="text-sm text-serenity-600">Encuentra inspiración diaria</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-green-600" />
              </button>

              <button
                onClick={() => window.location.href = '/chat'}
                className="w-full flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <div className="flex items-center">
                  <MessageCircle className="w-6 h-6 text-purple-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-serenity-800">Iniciar Chat</p>
                    <p className="text-sm text-serenity-600">Habla sobre tus inquietudes</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-purple-600" />
              </button>

              <button
                onClick={() => window.location.href = '/mood'}
                className="w-full flex items-center justify-between p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
              >
                <div className="flex items-center">
                  <Heart className="w-6 h-6 text-pink-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-serenity-800">Registrar Estado de Ánimo</p>
                    <p className="text-sm text-serenity-600">Mantén tu diario emocional</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-pink-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-8 bg-gradient-to-r from-serenia-600 to-serenity-600 rounded-xl p-8 text-center text-white">
          <Star className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold mb-4">
            &ldquo;Todo lo puedo en Cristo que me fortalece&rdquo;
          </h2>
          <p className="text-lg opacity-90 mb-6">
            Filipenses 4:13 - Continúa tu camino de crecimiento con fe y esperanza
          </p>
          <button
            onClick={() => window.location.href = '/verses'}
            className="bg-white text-serenia-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Explorar Más Versículos
          </button>
        </div>
      </div>
    </div>
  )
}