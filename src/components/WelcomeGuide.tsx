'use client'

import { useState, useEffect } from 'react'
import { X, ArrowRight, MessageCircle, Heart, BookOpen, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export function WelcomeGuide() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "¡Bienvenido a SerenIA! 👋",
      description: "Soy tu asistente de bienestar emocional. Te ayudo a encontrar paz interior y crecimiento personal.",
      icon: Heart,
      action: { text: "Comenzar", link: null }
    },
    {
      title: "Conversemos 💬",
      description: "Puedes hablarme sobre tus sentimientos, preocupaciones o pedir una oración. Estoy aquí para escucharte.",
      icon: MessageCircle,
      action: { text: "Ir al Chat", link: "/chat" }
    },
    {
      title: "Registro de Estado 📊",
      description: "Registra cómo te sientes diariamente y observa patrones en tu bienestar emocional.",
      icon: Heart,
      action: { text: "Registrar Estado", link: "/mood" }
    },
    {
      title: "Versículos Diarios 📖",
      description: "Encuentra versículos bíblicos que hablen a tu corazón según tu situación actual.",
      icon: BookOpen,
      action: { text: "Ver Versículos", link: "/verses" }
    }
  ]

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('serenia-welcome-seen')
    if (!hasSeenGuide) {
      setTimeout(() => setIsVisible(true), 1000)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeGuide()
    }
  }

  const completeGuide = () => {
    localStorage.setItem('serenia-welcome-seen', 'true')
    setIsVisible(false)
  }

  const skipGuide = () => {
    localStorage.setItem('serenia-welcome-seen', 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null

  const currentStepData = steps[currentStep]
  const Icon = currentStepData.icon

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-serenia-100 rounded-full flex items-center justify-center">
              <Icon className="w-5 h-5 text-serenia-600" />
            </div>
            <span className="text-sm text-serenity-500">
              Paso {currentStep + 1} de {steps.length}
            </span>
          </div>
          <button 
            onClick={skipGuide}
            className="text-serenity-400 hover:text-serenity-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-serenia-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-serenia-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-serenia-600" />
          </div>
          
          <h2 className="text-xl font-bold text-serenity-800 mb-3">
            {currentStepData.title}
          </h2>
          
          <p className="text-serenity-600 leading-relaxed">
            {currentStepData.description}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {currentStepData.action.link ? (
            <Link
              href={currentStepData.action.link}
              onClick={completeGuide}
              className="w-full bg-serenia-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-serenia-700 transition-colors flex items-center justify-center"
            >
              {currentStepData.action.text}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          ) : (
            <button
              onClick={handleNext}
              className="w-full bg-serenia-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-serenia-700 transition-colors flex items-center justify-center"
            >
              {currentStepData.action.text}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          )}
          
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="w-full border border-serenity-300 text-serenity-600 py-3 px-4 rounded-lg font-semibold hover:bg-serenity-50 transition-colors"
            >
              Anterior
            </button>
          )}
          
          <button
            onClick={skipGuide}
            className="w-full text-serenity-500 text-sm hover:text-serenity-600 transition-colors"
          >
            Saltar guía
          </button>
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-center space-x-2 mt-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index <= currentStep ? 'bg-serenia-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function QuickTips() {
  const [isVisible, setIsVisible] = useState(false)

  const tips = [
    {
      icon: "💬",
      title: "Habla libremente",
      description: "Puedes escribir cualquier cosa en el chat. SerenIA entiende tus emociones."
    },
    {
      icon: "🚨",
      title: "Detección de crisis",
      description: "Si detecta que necesitas ayuda urgente, te proporcionará recursos inmediatos."
    },
    {
      icon: "📖",
      title: "Versículos personalizados",
      description: "Los versículos se adaptan a tu estado emocional actual."
    },
    {
      icon: "📊",
      title: "Seguimiento de progreso",
      description: "Registra tu estado diario para ver patrones de mejora."
    }
  ]

  useEffect(() => {
    const hasSeenTips = localStorage.getItem('serenia-tips-seen')
    const welcomeSeen = localStorage.getItem('serenia-welcome-seen')
    
    if (welcomeSeen && !hasSeenTips) {
      setTimeout(() => setIsVisible(true), 3000)
    }
  }, [])

  const closeTips = () => {
    localStorage.setItem('serenia-tips-seen', 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-xl border border-serenia-200 p-4 max-w-sm z-40">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-serenity-800">💡 Consejos Rápidos</h3>
        <button 
          onClick={closeTips}
          className="text-serenity-400 hover:text-serenity-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-3">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start space-x-2">
            <span className="text-lg">{tip.icon}</span>
            <div>
              <p className="text-sm font-medium text-serenity-800">{tip.title}</p>
              <p className="text-xs text-serenity-600">{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={closeTips}
        className="w-full mt-4 bg-serenia-50 text-serenia-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-serenia-100 transition-colors"
      >
        ¡Entendido!
      </button>
    </div>
  )
}