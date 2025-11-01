'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Navigation } from '@/components/Navigation'
import {
  Bot,
  Settings,
  Activity,
  Users,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Send,
  Calendar,
  BarChart3,
  Zap,
  Clock,
  Globe,
  Shield,
  ExternalLink
} from 'lucide-react'

interface BotStatus {
  bot_info?: {
    username: string
    first_name: string
    id: number
    can_join_groups: boolean
    can_read_all_group_messages: boolean
    supports_inline_queries: boolean
  }
  webhook_info?: {
    url: string
    has_custom_certificate: boolean
    pending_update_count: number
    last_error_date?: number
    last_error_message?: string
    max_connections: number
    allowed_updates: string[]
  }
  is_configured: boolean
  error?: string
}

export default function TelegramPage() {
  const { data: session } = useSession()
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [configuring, setConfiguring] = useState(false)

  useEffect(() => {
    checkBotStatus()
  }, [])

  const checkBotStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/telegram/setup')
      const data = await response.json()
      
      if (response.ok) {
        setBotStatus({
          ...data,
          is_configured: true
        })
      } else {
        setBotStatus({
          is_configured: false,
          error: data.error || 'Error desconocido'
        })
      }
    } catch (error) {
      setBotStatus({
        is_configured: false,
        error: 'Error de conexión'
      })
    } finally {
      setLoading(false)
    }
  }

  const configureBotWebhook = async () => {
    try {
      setConfiguring(true)
      const response = await fetch('/api/telegram/setup', { method: 'POST' })
      const data = await response.json()
      
      if (response.ok) {
        setBotStatus({
          ...data,
          is_configured: true
        })
        alert('✅ Bot configurado exitosamente')
      } else {
        alert('❌ Error configurando bot: ' + data.error)
      }
    } catch (error) {
      alert('❌ Error de conexión al configurar bot')
    } finally {
      setConfiguring(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Navigation />
        <div className="pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                <div className="h-32 bg-white rounded-xl"></div>
                <div className="h-32 bg-white rounded-xl"></div>
                <div className="h-32 bg-white rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-6">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Bot de Telegram
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Panel de administración y configuración del bot de SerenIA para Telegram
            </p>
          </div>

          {/* Estado del Bot */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Activity className="w-6 h-6 mr-2" />
                Estado del Bot
              </h2>
              <button
                onClick={checkBotStatus}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>

            {botStatus?.is_configured ? (
              <div className="space-y-6">
                {/* Información del Bot */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      <h3 className="font-semibold text-green-800">Bot Activo</h3>
                    </div>
                    <div className="space-y-2 text-sm text-green-700">
                      <p><strong>Usuario:</strong> @{botStatus.bot_info?.username}</p>
                      <p><strong>Nombre:</strong> {botStatus.bot_info?.first_name}</p>
                      <p><strong>ID:</strong> {botStatus.bot_info?.id}</p>
                    </div>
                    {botStatus.bot_info?.username && (
                      <a
                        href={`https://t.me/${botStatus.bot_info.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center mt-3 text-green-600 hover:text-green-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Abrir en Telegram
                      </a>
                    )}
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <Globe className="w-5 h-5 text-blue-500 mr-2" />
                      <h3 className="font-semibold text-blue-800">Webhook</h3>
                    </div>
                    <div className="space-y-2 text-sm text-blue-700">
                      <p><strong>URL:</strong> <span className="break-all">{botStatus.webhook_info?.url}</span></p>
                      <p><strong>Actualizaciones pendientes:</strong> {botStatus.webhook_info?.pending_update_count}</p>
                      <p><strong>Conexiones máximas:</strong> {botStatus.webhook_info?.max_connections}</p>
                    </div>
                  </div>
                </div>

                {/* Capacidades del Bot */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Capacidades
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        botStatus.bot_info?.can_join_groups ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span>Unirse a grupos</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        botStatus.bot_info?.can_read_all_group_messages ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span>Leer mensajes de grupo</span>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        botStatus.bot_info?.supports_inline_queries ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span>Consultas inline</span>
                    </div>
                  </div>
                </div>

                {/* Errores del webhook si existen */}
                {botStatus.webhook_info?.last_error_message && (
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                      <h3 className="font-semibold text-red-800">Último Error</h3>
                    </div>
                    <p className="text-sm text-red-700 mb-2">
                      <strong>Fecha:</strong> {new Date(botStatus.webhook_info.last_error_date! * 1000).toLocaleString()}
                    </p>
                    <p className="text-sm text-red-700">
                      <strong>Mensaje:</strong> {botStatus.webhook_info.last_error_message}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Bot no configurado
                </h3>
                <p className="text-gray-600 mb-6">
                  {botStatus?.error || 'El bot de Telegram no está configurado correctamente'}
                </p>
                <button
                  onClick={configureBotWebhook}
                  disabled={configuring}
                  className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  <Settings className={`w-5 h-5 mr-2 ${configuring ? 'animate-spin' : ''}`} />
                  {configuring ? 'Configurando...' : 'Configurar Bot'}
                </button>
              </div>
            )}
          </div>

          {/* Instrucciones de Uso */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <MessageSquare className="w-6 h-6 mr-2" />
              Cómo usar el Bot
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Comandos Disponibles</h3>
                <div className="space-y-3">
                  {[
                    { command: '/start', description: 'Iniciar el bot y recibir bienvenida' },
                    { command: '/checkin', description: 'Evaluación rápida del estado emocional' },
                    { command: '/verse', description: 'Recibir versículo personalizado' },
                    { command: '/activity', description: 'Actividad de bienestar guiada' },
                    { command: '/crisis', description: 'Recursos de ayuda en crisis' },
                    { command: '/help', description: 'Ver todos los comandos' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-blue-600 mr-3 min-w-fit">
                        {item.command}
                      </code>
                      <span className="text-gray-600 text-sm">{item.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Características</h3>
                <div className="space-y-3">
                  {[
                    { icon: Bot, text: 'Respuestas inteligentes y empáticas' },
                    { icon: BarChart3, text: 'Monitoreo emocional integrado' },
                    { icon: Clock, text: 'Notificaciones programadas' },
                    { icon: Zap, text: 'Detección automática de crisis' },
                    { icon: Users, text: 'Actividades de bienestar guiadas' },
                    { icon: Calendar, text: 'Versículos personalizados diarios' }
                  ].map((item, index) => {
                    const Icon = item.icon
                    return (
                      <div key={index} className="flex items-center">
                        <Icon className="w-5 h-5 text-blue-500 mr-3" />
                        <span className="text-gray-600 text-sm">{item.text}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Guía de Configuración */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Settings className="w-6 h-6 mr-2" />
              Configuración de Producción
            </h2>
            
            <div className="space-y-6">
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Variables de Entorno Requeridas</h3>
                <div className="space-y-2 text-sm text-yellow-700">
                  <div><code className="bg-yellow-100 px-2 py-1 rounded">TELEGRAM_BOT_TOKEN</code> - Token del bot obtenido de @BotFather</div>
                  <div><code className="bg-yellow-100 px-2 py-1 rounded">TELEGRAM_WEBHOOK_URL</code> - URL del webhook (opcional)</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Pasos para Configurar</h3>
                  <ol className="space-y-2 text-sm text-gray-600">
                    <li>1. Crear bot con @BotFather en Telegram</li>
                    <li>2. Obtener token del bot</li>
                    <li>3. Configurar variables en Vercel</li>
                    <li>4. Hacer deploy de la aplicación</li>
                    <li>5. Configurar webhook usando el botón arriba</li>
                    <li>6. Probar el bot con /start</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Recursos Útiles</h3>
                  <div className="space-y-2">
                    <a 
                      href="https://t.me/BotFather" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      @BotFather en Telegram
                    </a>
                    <a 
                      href="/TELEGRAM_BOT_SETUP.md" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Guía completa de configuración
                    </a>
                    <a 
                      href="https://vercel.com/dashboard" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Panel de Vercel
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}