'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Navigation } from '@/components/Navigation'
import {
  Zap,
  Brain,
  Clock,
  TrendingUp,
  Bell,
  Settings,
  Play,
  Pause,
  Eye,
  BarChart3,
  Calendar,
  Users,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Lightbulb,
  Filter,
  RefreshCw,
  Download,
  Upload,
  FileText,
  Heart,
  MessageCircle,
  BookOpen,
  TestTube
} from 'lucide-react'

interface AutomationWorkflow {
  id: string
  name: string
  description: string
  category: 'analysis' | 'notification' | 'monitoring' | 'recommendation'
  status: 'active' | 'paused' | 'disabled'
  triggers: string[]
  actions: string[]
  lastRun?: string
  successRate: number
  executionCount: number
  avgExecutionTime: string
  isDefault: boolean
}

interface AutomationInsight {
  id: string
  type: 'pattern' | 'anomaly' | 'recommendation' | 'alert'
  title: string
  description: string
  severity: 'low' | 'medium' | 'high'
  category: string
  data: any
  createdAt: string
  isRead: boolean
  actionTaken?: string
}

interface AutomationStats {
  totalWorkflows: number
  activeWorkflows: number
  totalExecutions: number
  successfulExecutions: number
  insightsGenerated: number
  patternsDetected: number
  notificationsSent: number
  avgResponseTime: string
}

export default function AutomationPage() {
  const { data: session, status } = useSession()
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([])
  const [insights, setInsights] = useState<AutomationInsight[]>([])
  const [stats, setStats] = useState<AutomationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedWorkflow, setSelectedWorkflow] = useState<AutomationWorkflow | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    
    if (status === 'unauthenticated') {
      window.location.href = '/auth/signin'
      return
    }

    if (session?.user) {
      loadAutomationData()
    }
  }, [session, status])

  const loadAutomationData = async () => {
    try {
      // Simular carga de datos de automatización
      const mockWorkflows: AutomationWorkflow[] = [
        {
          id: 'workflow-1',
          name: 'Análisis de Patrones Emocionales',
          description: 'Detecta patrones en el estado de ánimo y sugiere intervenciones proactivas',
          category: 'analysis',
          status: 'active',
          triggers: ['Nuevo registro de estado de ánimo', 'Completar test psicológico'],
          actions: ['Analizar tendencias', 'Generar recomendaciones', 'Enviar notificación si es necesario'],
          lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          successRate: 96.5,
          executionCount: 847,
          avgExecutionTime: '2.3s',
          isDefault: true
        },
        {
          id: 'workflow-2',
          name: 'Recordatorios Inteligentes',
          description: 'Optimiza el timing de recordatorios basado en la actividad del usuario',
          category: 'notification',
          status: 'active',
          triggers: ['Cambio de actividad', 'Hora programada', 'Detección de estrés'],
          actions: ['Evaluar contexto', 'Personalizar mensaje', 'Enviar recordatorio'],
          lastRun: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          successRate: 89.2,
          executionCount: 1204,
          avgExecutionTime: '1.1s',
          isDefault: true
        },
        {
          id: 'workflow-3',
          name: 'Detección de Crisis',
          description: 'Identifica señales de riesgo y activa protocolos de emergencia',
          category: 'monitoring',
          status: 'active',
          triggers: ['Respuestas de alto riesgo', 'Patrones de aislamiento', 'Lenguaje de crisis'],
          actions: ['Evaluar nivel de riesgo', 'Contactar recursos de apoyo', 'Notificar profesionales'],
          lastRun: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          successRate: 100,
          executionCount: 23,
          avgExecutionTime: '0.8s',
          isDefault: true
        },
        {
          id: 'workflow-4',
          name: 'Recomendaciones de Contenido',
          description: 'Sugiere versículos y contenido basado en el estado emocional actual',
          category: 'recommendation',
          status: 'active',
          triggers: ['Registro de estado de ánimo', 'Interacción con contenido', 'Tiempo desde última lectura'],
          actions: ['Analizar preferencias', 'Seleccionar contenido relevante', 'Personalizar presentación'],
          lastRun: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          successRate: 94.7,
          executionCount: 2156,
          avgExecutionTime: '1.8s',
          isDefault: true
        },
        {
          id: 'workflow-5',
          name: 'Análisis de Progreso',
          description: 'Evalúa el progreso del usuario y ajusta el plan de bienestar',
          category: 'analysis',
          status: 'active',
          triggers: ['Semana completada', 'Mes completado', 'Hito alcanzado'],
          actions: ['Analizar métricas', 'Generar reporte', 'Ajustar recomendaciones'],
          lastRun: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          successRate: 98.1,
          executionCount: 156,
          avgExecutionTime: '4.2s',
          isDefault: false
        },
        {
          id: 'workflow-6',
          name: 'Moderación Comunitaria',
          description: 'Monitorea y modera automáticamente el contenido de la comunidad',
          category: 'monitoring',
          status: 'paused',
          triggers: ['Nueva publicación', 'Reporte de usuario', 'Análisis de sentimiento'],
          actions: ['Analizar contenido', 'Aplicar filtros', 'Notificar moderadores si es necesario'],
          lastRun: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          successRate: 87.3,
          executionCount: 634,
          avgExecutionTime: '1.5s',
          isDefault: false
        }
      ]

      const mockInsights: AutomationInsight[] = [
        {
          id: 'insight-1',
          type: 'pattern',
          title: 'Patrón de Mejora Detectado',
          description: 'Tu estado de ánimo ha mejorado consistentemente en las últimas 2 semanas. Las oraciones matutinas parecen tener un impacto positivo.',
          severity: 'low',
          category: 'bienestar',
          data: { trend: 'positive', confidence: 85, period: '14 days' },
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          isRead: false
        },
        {
          id: 'insight-2',
          type: 'recommendation',
          title: 'Optimización de Recordatorios',
          description: 'Basado en tu actividad, los recordatorios de oración funcionan mejor a las 7:30 AM en lugar de las 8:00 AM.',
          severity: 'medium',
          category: 'notificaciones',
          data: { suggestedTime: '07:30', currentTime: '08:00', engagement: '+23%' },
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          isRead: false
        },
        {
          id: 'insight-3',
          type: 'anomaly',
          title: 'Cambio en Patrones de Sueño',
          description: 'Se detectó un cambio en tus patrones de actividad nocturna. Considera revisar tu rutina de descanso.',
          severity: 'medium',
          category: 'salud',
          data: { changeDetected: '22:30 -> 23:45', impact: 'sleep_quality' },
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          isRead: true,
          actionTaken: 'recommendation_sent'
        },
        {
          id: 'insight-4',
          type: 'alert',
          title: 'Período de Estrés Detectado',
          description: 'Los últimos 3 tests indican niveles elevados de estrés. Se activaron protocolos de apoyo.',
          severity: 'high',
          category: 'crisis',
          data: { stressLevel: 'high', duration: '3 days', actionsTriggered: ['support_resources', 'content_adjustment'] },
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          isRead: true,
          actionTaken: 'support_provided'
        }
      ]

      const mockStats: AutomationStats = {
        totalWorkflows: 6,
        activeWorkflows: 5,
        totalExecutions: 5020,
        successfulExecutions: 4697,
        insightsGenerated: 147,
        patternsDetected: 23,
        notificationsSent: 892,
        avgResponseTime: '1.8s'
      }

      setWorkflows(mockWorkflows)
      setInsights(mockInsights)
      setStats(mockStats)
    } catch (error) {
      console.error('Error loading automation data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleWorkflow = async (workflowId: string) => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === workflowId 
        ? { 
            ...workflow, 
            status: workflow.status === 'active' ? 'paused' : 'active' 
          }
        : workflow
    ))
  }

  const markInsightAsRead = async (insightId: string) => {
    setInsights(prev => prev.map(insight => 
      insight.id === insightId 
        ? { ...insight, isRead: true }
        : insight
    ))
  }

  const filteredWorkflows = selectedCategory === 'all' 
    ? workflows 
    : workflows.filter(w => w.category === selectedCategory)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'paused': return 'text-yellow-600 bg-yellow-100'
      case 'disabled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pattern': return TrendingUp
      case 'anomaly': return AlertTriangle
      case 'recommendation': return Lightbulb
      case 'alert': return Bell
      default: return Activity
    }
  }

  const categories = [
    { value: 'all', label: 'Todos', count: workflows.length },
    { value: 'analysis', label: 'Análisis', count: workflows.filter(w => w.category === 'analysis').length },
    { value: 'notification', label: 'Notificaciones', count: workflows.filter(w => w.category === 'notification').length },
    { value: 'monitoring', label: 'Monitoreo', count: workflows.filter(w => w.category === 'monitoring').length },
    { value: 'recommendation', label: 'Recomendaciones', count: workflows.filter(w => w.category === 'recommendation').length }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-serenia-600 mx-auto mb-4"></div>
              <p className="text-serenity-600">Cargando automatización...</p>
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
            <Zap className="w-12 h-12 text-serenia-500 mr-3" />
            <h1 className="text-4xl font-bold text-serenia-800">Automatización Inteligente</h1>
          </div>
          <p className="text-xl text-serenity-600 max-w-3xl mx-auto">
            Workflows automatizados que analizan patrones, detectan necesidades y optimizan tu experiencia de bienestar
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <Zap className="w-8 h-8 text-serenia-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-serenia-600">{stats.activeWorkflows}</p>
                  <p className="text-sm text-serenity-600">Workflows Activos</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <BarChart3 className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalExecutions.toLocaleString()}</p>
                  <p className="text-sm text-serenity-600">Ejecuciones Totales</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <Brain className="w-8 h-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-purple-600">{stats.insightsGenerated}</p>
                  <p className="text-sm text-serenity-600">Insights Generados</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round((stats.successfulExecutions / stats.totalExecutions) * 100)}%
                  </p>
                  <p className="text-sm text-serenity-600">Tasa de Éxito</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Insights Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Brain className="w-6 h-6 text-serenia-500 mr-3" />
              <h2 className="text-xl font-bold text-serenity-800">Insights Recientes</h2>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-serenity-600">
                {insights.filter(i => !i.isRead).length} nuevos
              </span>
              <button className="p-2 text-serenity-400 hover:text-serenity-600 transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {insights.map((insight) => {
              const TypeIcon = getTypeIcon(insight.type)
              return (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                    insight.isRead 
                      ? 'bg-gray-50 border-gray-200' 
                      : 'bg-serenia-50 border-serenia-200 hover:bg-serenia-100'
                  }`}
                  onClick={() => markInsightAsRead(insight.id)}
                >
                  <div className="flex items-start">
                    <div className={`p-2 rounded-full mr-4 ${getSeverityColor(insight.severity)}`}>
                      <TypeIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-semibold ${insight.isRead ? 'text-serenity-700' : 'text-serenity-800'}`}>
                          {insight.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${getSeverityColor(insight.severity)}`}>
                            {insight.severity === 'high' && 'Alta'}
                            {insight.severity === 'medium' && 'Media'}
                            {insight.severity === 'low' && 'Baja'}
                          </span>
                          <span className="text-xs text-serenity-500">
                            {new Date(insight.createdAt).toLocaleDateString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                      <p className={`text-sm mb-2 ${insight.isRead ? 'text-serenity-600' : 'text-serenity-700'}`}>
                        {insight.description}
                      </p>
                      {insight.actionTaken && (
                        <div className="flex items-center text-xs text-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Acción tomada: {insight.actionTaken.replace('_', ' ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Workflows Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Settings className="w-6 h-6 text-serenia-500 mr-3" />
              <h2 className="text-xl font-bold text-serenity-800">Workflows de Automatización</h2>
            </div>
            <div className="flex items-center space-x-4">
              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedCategory === category.value
                        ? 'bg-serenia-500 text-white'
                        : 'bg-serenity-100 text-serenity-700 hover:bg-serenity-200'
                    }`}
                  >
                    {category.label} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filteredWorkflows.map((workflow) => (
              <div
                key={workflow.id}
                className="border border-serenity-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedWorkflow(workflow)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-serenity-800 mr-3">
                        {workflow.name}
                      </h3>
                      {workflow.isDefault && (
                        <span className="px-2 py-1 bg-serenia-100 text-serenia-700 rounded-full text-xs">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-serenity-600 text-sm mb-3">
                      {workflow.description}
                    </p>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleWorkflow(workflow.id)
                    }}
                    className={`p-2 rounded-full transition-colors ${
                      workflow.status === 'active'
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {workflow.status === 'active' ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-serenity-600">Estado:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(workflow.status)}`}>
                      {workflow.status === 'active' && 'Activo'}
                      {workflow.status === 'paused' && 'Pausado'}
                      {workflow.status === 'disabled' && 'Deshabilitado'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-serenity-600">Ejecuciones:</span>
                    <span className="font-medium text-serenity-800">{workflow.executionCount}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-serenity-600">Tasa de éxito:</span>
                    <span className="font-medium text-green-600">{workflow.successRate}%</span>
                  </div>

                  {workflow.lastRun && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-serenity-600">Última ejecución:</span>
                      <span className="text-serenity-700">
                        {new Date(workflow.lastRun).toLocaleDateString('es-ES', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-serenity-200">
                  <div className="text-xs text-serenity-500 mb-2">Triggers principales:</div>
                  <div className="flex flex-wrap gap-1">
                    {workflow.triggers.slice(0, 2).map((trigger, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-serenity-100 text-serenity-600 rounded text-xs"
                      >
                        {trigger}
                      </span>
                    ))}
                    {workflow.triggers.length > 2 && (
                      <span className="px-2 py-1 bg-serenity-100 text-serenity-600 rounded text-xs">
                        +{workflow.triggers.length - 2} más
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Detail Modal */}
        {selectedWorkflow && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-serenity-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-serenity-800">{selectedWorkflow.name}</h2>
                    <p className="text-sm text-serenity-600">{selectedWorkflow.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedWorkflow(null)}
                    className="text-serenity-400 hover:text-serenity-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Status & Metrics */}
                  <div>
                    <h3 className="font-semibold text-serenity-800 mb-4">Estado y Métricas</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-serenity-600">Estado actual:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedWorkflow.status)}`}>
                          {selectedWorkflow.status === 'active' && 'Activo'}
                          {selectedWorkflow.status === 'paused' && 'Pausado'}
                          {selectedWorkflow.status === 'disabled' && 'Deshabilitado'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-serenity-600">Ejecuciones totales:</span>
                        <span className="font-medium">{selectedWorkflow.executionCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-serenity-600">Tasa de éxito:</span>
                        <span className="font-medium text-green-600">{selectedWorkflow.successRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-serenity-600">Tiempo promedio:</span>
                        <span className="font-medium">{selectedWorkflow.avgExecutionTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Configuration */}
                  <div>
                    <h3 className="font-semibold text-serenity-800 mb-4">Configuración</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-serenity-600 text-sm">Categoría:</span>
                        <p className="font-medium capitalize">{selectedWorkflow.category}</p>
                      </div>
                      <div>
                        <span className="text-serenity-600 text-sm">Tipo:</span>
                        <p className="font-medium">
                          {selectedWorkflow.isDefault ? 'Workflow por defecto' : 'Workflow personalizado'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Triggers */}
                <div className="mt-6">
                  <h3 className="font-semibold text-serenity-800 mb-4">Triggers (Disparadores)</h3>
                  <div className="space-y-2">
                    {selectedWorkflow.triggers.map((trigger, index) => (
                      <div key={index} className="flex items-center p-3 bg-serenia-50 rounded-lg">
                        <Play className="w-4 h-4 text-serenia-600 mr-3" />
                        <span className="text-serenity-700">{trigger}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6">
                  <h3 className="font-semibold text-serenity-800 mb-4">Acciones</h3>
                  <div className="space-y-2">
                    {selectedWorkflow.actions.map((action, index) => (
                      <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <Zap className="w-4 h-4 text-blue-600 mr-3" />
                        <span className="text-serenity-700">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Controls */}
                <div className="mt-6 pt-6 border-t border-serenity-200">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => toggleWorkflow(selectedWorkflow.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedWorkflow.status === 'active'
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {selectedWorkflow.status === 'active' ? 'Pausar' : 'Activar'}
                    </button>
                    <button className="px-4 py-2 bg-serenia-600 text-white rounded-lg font-medium hover:bg-serenia-700 transition-colors">
                      Editar
                    </button>
                    <button className="px-4 py-2 bg-serenity-200 text-serenity-700 rounded-lg font-medium hover:bg-serenity-300 transition-colors">
                      Ver Logs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}