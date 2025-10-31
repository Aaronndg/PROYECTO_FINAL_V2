'use client'

import { useState, useEffect } from 'react'
import { X, MessageCircle, Heart, Shield, Clock } from 'lucide-react'

export function ChatOnboarding() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasSeenChatGuide = localStorage.getItem('serenia-chat-guide-seen')
    if (!hasSeenChatGuide) {
      setTimeout(() => setIsVisible(true), 500)
    }
  }, [])

  const closeGuide = () => {
    localStorage.setItem('serenia-chat-guide-seen', 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="mb-6 bg-gradient-to-r from-serenia-50 to-purple-50 border border-serenia-200 rounded-xl p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-serenia-100 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-serenia-600" />
          </div>
          <div>
            <h3 className="font-semibold text-serenity-800">¡Empecemos a conversar! 💬</h3>
            <p className="text-sm text-serenity-600">Te ayudo a encontrar paz y bienestar</p>
          </div>
        </div>
        <button 
          onClick={closeGuide}
          className="text-serenity-400 hover:text-serenity-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-start space-x-3">
          <Heart className="w-5 h-5 text-serenia-500 mt-1 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-serenity-800">Habla con confianza</p>
            <p className="text-xs text-serenity-600">Puedes compartir cualquier sentimiento o preocupación</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-serenia-500 mt-1 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-serenity-800">Detección de crisis</p>
            <p className="text-xs text-serenity-600">Te ayudo si detecto que necesitas apoyo urgente</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Clock className="w-5 h-5 text-serenia-500 mt-1 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-serenity-800">Disponible 24/7</p>
            <p className="text-xs text-serenity-600">Siempre aquí cuando me necesites</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-serenia-100">
        <p className="text-sm text-serenity-700 mb-2">
          <strong>Ejemplos de cómo puedes empezar:</strong>
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs bg-serenia-50 text-serenia-700 px-3 py-1 rounded-full">
            "Me siento ansioso..."
          </span>
          <span className="text-xs bg-serenia-50 text-serenia-700 px-3 py-1 rounded-full">
            "Necesito una oración"
          </span>
          <span className="text-xs bg-serenia-50 text-serenia-700 px-3 py-1 rounded-full">
            "¿Cómo puedo encontrar paz?"
          </span>
        </div>
      </div>
    </div>
  )
}