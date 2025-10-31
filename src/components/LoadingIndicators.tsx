'use client'

import { Heart, Brain, Sparkles } from 'lucide-react'

export function LoadingIndicator({ 
  type = 'default',
  message = 'Pensando...'
}: {
  type?: 'default' | 'crisis' | 'verse' | 'mood'
  message?: string
}) {
  const getIcon = () => {
    switch (type) {
      case 'crisis':
        return <Heart className="w-5 h-5 text-red-500" />
      case 'verse':
        return <Sparkles className="w-5 h-5 text-purple-500" />
      case 'mood':
        return <Heart className="w-5 h-5 text-blue-500" />
      default:
        return <Brain className="w-5 h-5 text-serenia-500" />
    }
  }

  const getMessage = () => {
    switch (type) {
      case 'crisis':
        return 'Evaluando tu situación con cuidado...'
      case 'verse':
        return 'Buscando versículos que hablen a tu corazón...'
      case 'mood':
        return 'Procesando tu estado emocional...'
      default:
        return message
    }
  }

  return (
    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
      <div className="animate-pulse">
        {getIcon()}
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm text-serenity-600">{getMessage()}</span>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-serenia-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-serenia-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-serenia-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  )
}

export function TypingIndicator({ 
  isVisible = true 
}: {
  isVisible?: boolean
}) {
  if (!isVisible) return null

  return (
    <div className="flex items-start space-x-3 p-4">
      <div className="w-8 h-8 bg-serenia-100 rounded-full flex items-center justify-center flex-shrink-0">
        <Brain className="w-4 h-4 text-serenia-600" />
      </div>
      <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  )
}

export function ProcessingStatus({ 
  step = 1,
  total = 3,
  currentAction = 'Analizando mensaje...'
}: {
  step?: number
  total?: number
  currentAction?: string
}) {
  const progress = (step / total) * 100

  return (
    <div className="p-4 bg-serenia-50 border border-serenia-200 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-serenia-700">{currentAction}</span>
        <span className="text-xs text-serenia-500">{step}/{total}</span>
      </div>
      <div className="w-full bg-serenia-200 rounded-full h-2">
        <div 
          className="bg-serenia-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}