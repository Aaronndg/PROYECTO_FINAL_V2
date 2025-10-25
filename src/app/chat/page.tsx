'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Navigation } from '@/components/Navigation'
import { 
  Send, 
  MessageCircle, 
  Bot, 
  User, 
  Clock, 
  Heart, 
  BookOpen, 
  Brain,
  Plus,
  Trash2,
  Edit3,
  Download,
  Settings,
  Sparkles,
  Mic,
  Image as ImageIcon,
  Paperclip,
  MoreVertical
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  conversation_id: string
  metadata?: {
    type?: 'text' | 'suggestion' | 'scripture' | 'prayer'
    related_test?: string
    scripture_reference?: string
    emotion_detected?: string
  }
}

interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at: string
  message_count: number
  last_message_preview: string
}

export default function ChatPage() {
  const { data: session, status } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'loading') return
    
    if (status === 'unauthenticated') {
      window.location.href = '/auth/signin'
      return
    }

    if (session?.user) {
      loadConversations()
    }
  }, [session, status])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversations = async () => {
    try {
      // Simular carga de conversaciones
      const mockConversations: Conversation[] = [
        {
          id: 'conv-1',
          title: 'Manejo de la Ansiedad',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          message_count: 8,
          last_message_preview: 'Gracias por los consejos sobre la oración...'
        },
        {
          id: 'conv-2',
          title: 'Crecimiento Espiritual',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          message_count: 12,
          last_message_preview: 'Me gustaría profundizar más en mi relación con Dios...'
        },
        {
          id: 'conv-3',
          title: 'Relaciones Familiares',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          message_count: 6,
          last_message_preview: '¿Cómo puedo perdonar y sanar estas heridas?'
        }
      ]
      setConversations(mockConversations)
      
      // Cargar la conversación más reciente
      if (mockConversations.length > 0) {
        loadConversation(mockConversations[0].id)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    }
  }

  const loadConversation = async (conversationId: string) => {
    try {
      setCurrentConversation(conversationId)
      
      // Simular carga de mensajes de la conversación
      const mockMessages: Message[] = [
        {
          id: 'msg-1',
          role: 'user',
          content: 'Hola, últimamente me he sentido muy ansioso y no sé cómo manejar estos sentimientos.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          conversation_id: conversationId
        },
        {
          id: 'msg-2',
          role: 'assistant',
          content: 'Entiendo que te sientes ansioso, y quiero que sepas que no estás solo en esto. La ansiedad es algo que muchas personas experimentan, y hay maneras efectivas de manejarla desde una perspectiva de fe y bienestar.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000).toISOString(),
          conversation_id: conversationId,
          metadata: {
            emotion_detected: 'ansiedad'
          }
        },
        {
          id: 'msg-3',
          role: 'assistant',
          content: 'Recuerda las palabras de Filipenses 4:6-7: "Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús."',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 60000).toISOString(),
          conversation_id: conversationId,
          metadata: {
            type: 'scripture',
            scripture_reference: 'Filipenses 4:6-7'
          }
        },
        {
          id: 'msg-4',
          role: 'user',
          content: 'Ese versículo es hermoso. ¿Qué técnicas prácticas me recomiendas para aplicar esto en mi vida diaria?',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 120000).toISOString(),
          conversation_id: conversationId
        },
        {
          id: 'msg-5',
          role: 'assistant',
          content: 'Me alegra que ese versículo te haya tocado. Aquí tienes algunas técnicas prácticas:\n\n1. **Respiración con oración**: Cuando sientes ansiedad, respira profundo y repite "Dios está conmigo" al inhalar y "Su paz me llena" al exhalar.\n\n2. **Diario de gratitud**: Escribe 3 cosas por las que estás agradecido cada día.\n\n3. **Tiempo de oración específico**: Dedica 10-15 minutos diarios para entregar tus preocupaciones a Dios.\n\n¿Te gustaría que profundice en alguna de estas técnicas?',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 180000).toISOString(),
          conversation_id: conversationId,
          metadata: {
            type: 'suggestion'
          }
        }
      ]
      setMessages(mockMessages)
    } catch (error) {
      console.error('Error loading conversation:', error)
    }
  }

  const createNewConversation = async () => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'Nueva Conversación',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      message_count: 0,
      last_message_preview: ''
    }
    
    setConversations([newConv, ...conversations])
    setCurrentConversation(newConv.id)
    setMessages([])
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
      conversation_id: currentConversation || ''
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsLoading(true)

    try {
      console.log('🔥 Sending message to API:', currentInput)
      
      // Llamar al API real
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory: messages.slice(-5), // Últimos 5 mensajes para contexto
          userId: session?.user?.email || 'demo-user'
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const aiResponseData = await response.json()
      console.log('✅ Received AI response:', aiResponseData)

      const aiMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: aiResponseData.content || 'Lo siento, no pude procesar tu mensaje en este momento.',
        timestamp: new Date().toISOString(),
        conversation_id: currentConversation || '',
        metadata: {
          type: 'text',
          emotion_detected: aiResponseData.emotionDetected
        }
      }
      
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    } catch (error) {
      console.error('❌ Error sending message:', error)
      
      // Fallback response in case of error
      const fallbackMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: 'Lo siento, estoy teniendo dificultades técnicas en este momento. ¿Podrías intentar de nuevo? Si necesitas ayuda inmediata, recuerda que Dios está siempre contigo. 🙏💕',
        timestamp: new Date().toISOString(),
        conversation_id: currentConversation || '',
        metadata: {
          type: 'text'
        }
      }
      
      setMessages(prev => [...prev, fallbackMessage])
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = async (suggestionText: string) => {
    setInput(suggestionText)
    // Auto-send the message
    setTimeout(() => {
      sendMessage()
    }, 100)
  }

  const formatTime = (timestamp: string): string => {
    const time = new Date(timestamp)
    return time.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoy'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer'
    } else {
      return date.toLocaleDateString('es-ES', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getMessageIcon = (metadata?: Message['metadata']) => {
    switch (metadata?.type) {
      case 'scripture': return BookOpen
      case 'prayer': return Heart
      case 'suggestion': return Sparkles
      default: return Bot
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-serenia-600 mx-auto mb-4"></div>
              <p className="text-serenity-600">Cargando...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          {/* Sidebar */}
          {showSidebar && (
            <div className="w-80 bg-serenity-50 border-r border-serenity-200 flex flex-col">
              {/* Sidebar Header */}
              <div className="p-4 border-b border-serenity-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-serenity-800">Conversaciones</h2>
                  <button
                    onClick={createNewConversation}
                    className="p-2 bg-serenia-600 text-white rounded-lg hover:bg-serenia-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => loadConversation(conv.id)}
                    className={`w-full p-4 text-left border-b border-serenity-200 hover:bg-serenity-100 transition-colors ${
                      currentConversation === conv.id ? 'bg-serenia-50 border-r-4 border-r-serenia-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-serenity-800 truncate">{conv.title}</h3>
                        <p className="text-sm text-serenity-600 truncate mt-1">
                          {conv.last_message_preview}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-serenity-500">
                            {formatDate(conv.updated_at)}
                          </span>
                          <span className="text-xs text-serenity-500">
                            {conv.message_count} mensajes
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-serenity-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {!showSidebar && (
                    <button
                      onClick={() => setShowSidebar(true)}
                      className="p-2 text-serenity-600 hover:bg-serenity-100 rounded-lg mr-3"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  )}
                  <div className="flex items-center">
                    <div className="p-2 bg-serenia-100 rounded-full mr-3">
                      <Bot className="w-6 h-6 text-serenia-600" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-serenia-800">SerenIA</h1>
                      <p className="text-sm text-serenity-600">Tu asistente espiritual y de bienestar</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {showSidebar && (
                    <button
                      onClick={() => setShowSidebar(false)}
                      className="p-2 text-serenity-600 hover:bg-serenity-100 rounded-lg"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 bg-serenia-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-serenia-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-serenity-800 mb-2">
                    ¡Hola! Soy SerenIA
                  </h3>
                  <p className="text-serenity-600 mb-6 max-w-md mx-auto">
                    Estoy aquí para acompañarte en tu jornada de fe y bienestar. 
                    Puedes contarme tus inquietudes, pedirme oración, o simplemente conversar.
                  </p>
                  <div className="grid md:grid-cols-2 gap-3 max-w-lg mx-auto">
                    <button
                      onClick={() => handleSuggestionClick('Me siento ansioso últimamente...')}
                      className="p-3 bg-serenia-50 rounded-lg text-sm text-serenia-700 hover:bg-serenia-100 transition-colors"
                    >
                      💙 Hablar sobre ansiedad
                    </button>
                    <button
                      onClick={() => handleSuggestionClick('¿Puedes ayudarme con una oración?')}
                      className="p-3 bg-serenia-50 rounded-lg text-sm text-serenia-700 hover:bg-serenia-100 transition-colors"
                    >
                      🙏 Pedir una oración
                    </button>
                    <button
                      onClick={() => handleSuggestionClick('¿Qué versículo me recomiendas hoy?')}
                      className="p-3 bg-serenia-50 rounded-lg text-sm text-serenia-700 hover:bg-serenia-100 transition-colors"
                    >
                      📖 Buscar un versículo
                    </button>
                    <button
                      onClick={() => handleSuggestionClick('Quiero crecer espiritualmente')}
                      className="p-3 bg-serenia-50 rounded-lg text-sm text-serenia-700 hover:bg-serenia-100 transition-colors"
                    >
                      ✨ Crecimiento espiritual
                    </button>
                  </div>
                </div>
              ) : (
                messages.map((message) => {
                  const MessageIcon = message.role === 'assistant' ? getMessageIcon(message.metadata) : User
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`p-2 rounded-full ${
                          message.role === 'user' 
                            ? 'bg-serenia-100 ml-3' 
                            : 'bg-serenity-100 mr-3'
                        }`}>
                          <MessageIcon className={`w-5 h-5 ${
                            message.role === 'user' ? 'text-serenia-600' : 'text-serenity-600'
                          }`} />
                        </div>
                        <div className={`rounded-lg p-4 ${
                          message.role === 'user'
                            ? 'bg-serenia-600 text-white'
                            : 'bg-serenity-100 text-serenity-800'
                        }`}>
                          {message.metadata?.scripture_reference && (
                            <div className="text-xs opacity-75 mb-2">
                              📖 {message.metadata.scripture_reference}
                            </div>
                          )}
                          <p className="whitespace-pre-line">{message.content}</p>
                          <div className={`text-xs mt-2 ${
                            message.role === 'user' ? 'text-serenia-200' : 'text-serenity-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex">
                    <div className="p-2 rounded-full bg-serenity-100 mr-3">
                      <Bot className="w-5 h-5 text-serenity-600" />
                    </div>
                    <div className="bg-serenity-100 rounded-lg p-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-serenity-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-serenity-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-serenity-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-serenity-200 bg-white">
              <div className="flex items-end space-x-2">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu mensaje aquí..."
                    className="w-full p-3 border border-serenity-300 rounded-lg resize-none focus:ring-2 focus:ring-serenia-500 focus:border-transparent"
                    rows={1}
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className={`p-3 rounded-lg transition-colors ${
                    input.trim() && !isLoading
                      ? 'bg-serenia-600 text-white hover:bg-serenia-700'
                      : 'bg-serenity-200 text-serenity-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center justify-between mt-3 text-sm text-serenity-600">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center hover:text-serenia-600 transition-colors">
                    <Heart className="w-4 h-4 mr-1" />
                    Oración
                  </button>
                  <button className="flex items-center hover:text-serenia-600 transition-colors">
                    <BookOpen className="w-4 h-4 mr-1" />
                    Versículo
                  </button>
                  <button className="flex items-center hover:text-serenia-600 transition-colors">
                    <Brain className="w-4 h-4 mr-1" />
                    Evaluación
                  </button>
                </div>
                <div className="text-xs text-serenity-500">
                  Presiona Enter para enviar
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}