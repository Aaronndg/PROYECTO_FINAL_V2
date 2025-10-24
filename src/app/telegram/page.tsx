'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Navigation } from '@/components/Navigation'
import {
  MessageCircle,
  Bell,
  Clock,
  Settings,
  Check,
  X,
  AlertCircle,
  Smartphone,
  Send,
  Calendar,
  Moon,
  Sun,
  Heart,
  BookOpen,
  TestTube,
  Users,
  Star,
  Copy,
  ExternalLink,
  Zap,
  Shield
} from 'lucide-react'

interface TelegramConfig {
  isConnected: boolean
  telegramId?: number
  username?: string
  firstName?: string
  lastActivity?: string
  reminders: {
    verse: { enabled: boolean; time: string }
    prayer: { enabled: boolean; time: string }
    mood: { enabled: boolean; frequency: 'daily' | 'weekly' }
    test: { enabled: boolean; frequency: 'weekly' | 'monthly' }
  }
  notifications: {
    community: boolean
    tests: boolean
    encouragement: boolean
  }
  language: string
  timezone: string
}

export default function TelegramPage() {
  const { data: session, status } = useSession()
  const [config, setConfig] = useState<TelegramConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showConnectionInstructions, setShowConnectionInstructions] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    
    if (status === 'unauthenticated') {
      window.location.href = '/auth/signin'
      return
    }

    if (session?.user) {
      loadTelegramConfig()
    }
  }, [session, status])

  const loadTelegramConfig = async () => {
    try {
      // Simular carga de configuración de Telegram
      const mockConfig: TelegramConfig = {
        isConnected: false, // Cambiar a true si el usuario ya conectó Telegram
        reminders: {
          verse: { enabled: true, time: '08:00' },
          prayer: { enabled: true, time: '19:00' },
          mood: { enabled: true, frequency: 'daily' },
          test: { enabled: false, frequency: 'weekly' }
        },
        notifications: {
          community: true,
          tests: false,
          encouragement: true
        },
        language: 'es',
        timezone: 'America/Mexico_City'
      }

      setConfig(mockConfig)
    } catch (error) {
      console.error('Error loading Telegram config:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateReminderSettings = async (type: keyof TelegramConfig['reminders'], updates: any) => {
    if (!config) return

    setSaving(true)
    try {
      const newConfig = {
        ...config,
        reminders: {
          ...config.reminders,
          [type]: {
            ...config.reminders[type],
            ...updates
          }
        }
      }

      setConfig(newConfig)
      
      // Aquí se implementaría la API call para guardar cambios
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay

    } catch (error) {
      console.error('Error updating reminder settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateNotificationSettings = async (type: keyof TelegramConfig['notifications'], enabled: boolean) => {
    if (!config) return

    setSaving(true)
    try {
      const newConfig = {
        ...config,
        notifications: {
          ...config.notifications,
          [type]: enabled
        }
      }

      setConfig(newConfig)
      
      // Aquí se implementaría la API call para guardar cambios
      await new Promise(resolve => setTimeout(resolve, 500)) // Simular delay

    } catch (error) {
      console.error('Error updating notification settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const disconnectTelegram = async () => {
    if (!config) return

    setSaving(true)
    try {
      const newConfig = {
        ...config,
        isConnected: false,
        telegramId: undefined,
        username: undefined,
        firstName: undefined,
        lastActivity: undefined
      }

      setConfig(newConfig)
      
      // Aquí se implementaría la API call para desconectar
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simular delay

    } catch (error) {
      console.error('Error disconnecting Telegram:', error)
    } finally {
      setSaving(false)
    }
  }

  const copyBotUsername = () => {
    const botUsername = '@SerenIABot' // Reemplazar con el username real del bot
    navigator.clipboard.writeText(botUsername)
    // Mostrar mensaje de éxito (implementar toast)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-serenia-600 mx-auto mb-4"></div>
              <p className="text-serenity-600">Cargando configuración...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-serenity-800 mb-2">Error de configuración</h2>
            <p className="text-serenity-600">No se pudo cargar la configuración de Telegram.</p>
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
            <MessageCircle className="w-12 h-12 text-serenia-500 mr-3" />
            <h1 className="text-4xl font-bold text-serenia-800">Bot de Telegram</h1>
          </div>
          <p className="text-xl text-serenity-600 max-w-3xl mx-auto">
            Lleva SerenIA contigo y recibe acompañamiento espiritual directamente en Telegram
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Connection Status */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  config.isConnected ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  {config.isConnected ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-serenity-800">
                    {config.isConnected ? 'Telegram Conectado' : 'Telegram No Conectado'}
                  </h2>
                  <p className="text-serenity-600">
                    {config.isConnected 
                      ? `Conectado como ${config.firstName} (@${config.username})`
                      : 'Conecta tu cuenta de Telegram para recibir acompañamiento personalizado'
                    }
                  </p>
                </div>
              </div>

              {config.isConnected ? (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-serenity-500">Última actividad</p>
                    <p className="text-sm font-medium text-serenity-700">
                      {config.lastActivity || 'Hace unos minutos'}
                    </p>
                  </div>
                  <button
                    onClick={disconnectTelegram}
                    disabled={saving}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Desconectando...' : 'Desconectar'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowConnectionInstructions(true)}
                  className="bg-serenia-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-serenia-700 transition-colors flex items-center"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Conectar Telegram
                </button>
              )}
            </div>
          </div>

          {/* Features Overview */}
          <div className="lg:col-span-3 grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <BookOpen className="w-12 h-12 text-serenia-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-serenity-800 mb-2">Versículos Diarios</h3>
              <p className="text-serenity-600 text-sm">Recibe versículos personalizados cada mañana</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-serenity-800 mb-2">Check-in Emocional</h3>
              <p className="text-serenity-600 text-sm">Monitorea tu bienestar con recordatorios amables</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <TestTube className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-serenity-800 mb-2">Tests Rápidos</h3>
              <p className="text-serenity-600 text-sm">Evaluaciones de bienestar directamente en chat</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-serenity-800 mb-2">IA Contextual</h3>
              <p className="text-serenity-600 text-sm">Respuestas empáticas basadas en sabiduría bíblica</p>
            </div>
          </div>

          {/* Reminder Settings */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <Bell className="w-6 h-6 text-serenia-500 mr-3" />
              <h2 className="text-xl font-bold text-serenity-800">Recordatorios</h2>
            </div>

            <div className="space-y-6">
              {/* Versículo diario */}
              <div className="flex items-center justify-between p-4 bg-serenia-50 rounded-lg">
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 text-serenia-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-serenity-800">Versículo del día</h3>
                    <p className="text-sm text-serenity-600">Recibe inspiración matutina</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="time"
                    value={config.reminders.verse.time}
                    onChange={(e) => updateReminderSettings('verse', { time: e.target.value })}
                    disabled={!config.reminders.verse.enabled || saving}
                    className="px-2 py-1 border border-serenity-300 rounded text-sm disabled:bg-gray-100"
                  />
                  <button
                    onClick={() => updateReminderSettings('verse', { enabled: !config.reminders.verse.enabled })}
                    disabled={saving}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      config.reminders.verse.enabled 
                        ? 'bg-serenia-500' 
                        : 'bg-serenity-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                      config.reminders.verse.enabled ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Oración vespertina */}
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-serenity-800">Oración vespertina</h3>
                    <p className="text-sm text-serenity-600">Momento de paz al final del día</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="time"
                    value={config.reminders.prayer.time}
                    onChange={(e) => updateReminderSettings('prayer', { time: e.target.value })}
                    disabled={!config.reminders.prayer.enabled || saving}
                    className="px-2 py-1 border border-serenity-300 rounded text-sm disabled:bg-gray-100"
                  />
                  <button
                    onClick={() => updateReminderSettings('prayer', { enabled: !config.reminders.prayer.enabled })}
                    disabled={saving}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      config.reminders.prayer.enabled 
                        ? 'bg-yellow-500' 
                        : 'bg-serenity-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                      config.reminders.prayer.enabled ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Check-in emocional */}
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <Heart className="w-5 h-5 text-red-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-serenity-800">Check-in emocional</h3>
                    <p className="text-sm text-serenity-600">Monitoreo de tu bienestar</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <select
                    value={config.reminders.mood.frequency}
                    onChange={(e) => updateReminderSettings('mood', { frequency: e.target.value })}
                    disabled={!config.reminders.mood.enabled || saving}
                    className="px-2 py-1 border border-serenity-300 rounded text-sm disabled:bg-gray-100"
                  >
                    <option value="daily">Diario</option>
                    <option value="weekly">Semanal</option>
                  </select>
                  <button
                    onClick={() => updateReminderSettings('mood', { enabled: !config.reminders.mood.enabled })}
                    disabled={saving}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      config.reminders.mood.enabled 
                        ? 'bg-red-500' 
                        : 'bg-serenity-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                      config.reminders.mood.enabled ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>

              {/* Tests de bienestar */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <TestTube className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-serenity-800">Tests de bienestar</h3>
                    <p className="text-sm text-serenity-600">Evaluaciones periódicas completas</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <select
                    value={config.reminders.test.frequency}
                    onChange={(e) => updateReminderSettings('test', { frequency: e.target.value })}
                    disabled={!config.reminders.test.enabled || saving}
                    className="px-2 py-1 border border-serenity-300 rounded text-sm disabled:bg-gray-100"
                  >
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensual</option>
                  </select>
                  <button
                    onClick={() => updateReminderSettings('test', { enabled: !config.reminders.test.enabled })}
                    disabled={saving}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      config.reminders.test.enabled 
                        ? 'bg-blue-500' 
                        : 'bg-serenity-300'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                      config.reminders.test.enabled ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 text-serenia-500 mr-3" />
              <h2 className="text-xl font-bold text-serenity-800">Notificaciones</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-serenity-800">Actividad comunitaria</h3>
                  <p className="text-xs text-serenity-600">Nuevas notas y comentarios</p>
                </div>
                <button
                  onClick={() => updateNotificationSettings('community', !config.notifications.community)}
                  disabled={saving}
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    config.notifications.community 
                      ? 'bg-serenia-500' 
                      : 'bg-serenity-300'
                  }`}
                >
                  <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform ${
                    config.notifications.community ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-serenity-800">Resultados de tests</h3>
                  <p className="text-xs text-serenity-600">Insights y recomendaciones</p>
                </div>
                <button
                  onClick={() => updateNotificationSettings('tests', !config.notifications.tests)}
                  disabled={saving}
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    config.notifications.tests 
                      ? 'bg-serenia-500' 
                      : 'bg-serenity-300'
                  }`}
                >
                  <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform ${
                    config.notifications.tests ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-serenity-800">Palabras de ánimo</h3>
                  <p className="text-xs text-serenity-600">Mensajes motivacionales</p>
                </div>
                <button
                  onClick={() => updateNotificationSettings('encouragement', !config.notifications.encouragement)}
                  disabled={saving}
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    config.notifications.encouragement 
                      ? 'bg-serenia-500' 
                      : 'bg-serenity-300'
                  }`}
                >
                  <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform ${
                    config.notifications.encouragement ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-serenity-200">
              <h3 className="font-medium text-serenity-800 mb-4">Acciones Rápidas</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-2 text-sm text-serenia-600 hover:bg-serenia-50 rounded transition-colors">
                  📱 Abrir chat en Telegram
                </button>
                <button className="w-full text-left p-2 text-sm text-serenia-600 hover:bg-serenia-50 rounded transition-colors">
                  🔄 Sincronizar configuración
                </button>
                <button className="w-full text-left p-2 text-sm text-serenia-600 hover:bg-serenia-50 rounded transition-colors">
                  📊 Ver estadísticas de uso
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Connection Instructions Modal */}
        {showConnectionInstructions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <MessageCircle className="w-12 h-12 text-serenia-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-serenity-800 mb-2">Conectar Telegram</h2>
                <p className="text-serenity-600">Sigue estos pasos para conectar tu cuenta</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-serenia-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">1</div>
                  <div>
                    <p className="font-medium text-serenity-800">Busca el bot en Telegram</p>
                    <div className="flex items-center mt-2 p-2 bg-gray-100 rounded">
                      <code className="text-sm text-serenia-600 flex-1">@SerenIABot</code>
                      <button
                        onClick={copyBotUsername}
                        className="ml-2 p-1 text-serenia-600 hover:text-serenia-700"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 bg-serenia-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">2</div>
                  <div>
                    <p className="font-medium text-serenity-800">Inicia conversación</p>
                    <p className="text-sm text-serenity-600 mt-1">Envía <code className="bg-gray-100 px-1 rounded">/start</code> para comenzar</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-6 h-6 bg-serenia-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">3</div>
                  <div>
                    <p className="font-medium text-serenity-800">Conecta tu cuenta</p>
                    <p className="text-sm text-serenity-600 mt-1">El bot te pedirá vincular con tu cuenta de SerenIA</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowConnectionInstructions(false)}
                  className="flex-1 bg-serenity-200 text-serenity-700 py-2 px-4 rounded-lg font-medium hover:bg-serenity-300 transition-colors"
                >
                  Cerrar
                </button>
                <a
                  href="https://t.me/SerenIABot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-serenia-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-serenia-700 transition-colors text-center"
                >
                  <ExternalLink className="w-4 h-4 inline mr-2" />
                  Abrir Bot
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}