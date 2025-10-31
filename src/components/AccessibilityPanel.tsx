'use client'

import { useState } from 'react'
import { 
  Settings, 
  Type, 
  Palette, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon,
  Minus,
  Plus,
  Eye,
  Maximize2,
  X
} from 'lucide-react'

export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isHighContrast, setIsHighContrast] = useState(false)
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)

  const handleFontSizeChange = (change: number) => {
    const newSize = Math.max(12, Math.min(24, fontSize + change))
    setFontSize(newSize)
    document.documentElement.style.fontSize = `${newSize}px`
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const toggleHighContrast = () => {
    setIsHighContrast(!isHighContrast)
    document.documentElement.classList.toggle('high-contrast')
  }

  const resetSettings = () => {
    setFontSize(16)
    setIsDarkMode(false)
    setIsHighContrast(false)
    setIsSoundEnabled(true)
    document.documentElement.style.fontSize = '16px'
    document.documentElement.classList.remove('dark', 'high-contrast')
  }

  return (
    <>
      {/* Accessibility Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 w-12 h-12 bg-serenia-600 text-white rounded-full shadow-lg hover:bg-serenia-700 transition-colors z-40 flex items-center justify-center"
        aria-label="Abrir panel de accesibilidad"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Accessibility Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-serenity-800">
                Opciones de Accesibilidad
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-serenity-400 hover:text-serenity-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Font Size */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-serenity-800 mb-3">
                <Type className="w-4 h-4 inline mr-2" />
                Tamaño de Texto
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleFontSizeChange(-2)}
                  className="w-8 h-8 bg-serenity-100 rounded-full flex items-center justify-center hover:bg-serenity-200 transition-colors"
                  disabled={fontSize <= 12}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium min-w-[60px] text-center">
                  {fontSize}px
                </span>
                <button
                  onClick={() => handleFontSizeChange(2)}
                  className="w-8 h-8 bg-serenity-100 rounded-full flex items-center justify-center hover:bg-serenity-200 transition-colors"
                  disabled={fontSize >= 24}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dark Mode */}
            <div className="mb-6">
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-serenity-800">
                  {isDarkMode ? <Moon className="w-4 h-4 inline mr-2" /> : <Sun className="w-4 h-4 inline mr-2" />}
                  Modo Oscuro
                </span>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isDarkMode ? 'bg-serenia-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            </div>

            {/* High Contrast */}
            <div className="mb-6">
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-serenity-800">
                  <Palette className="w-4 h-4 inline mr-2" />
                  Alto Contraste
                </span>
                <button
                  onClick={toggleHighContrast}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isHighContrast ? 'bg-serenia-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isHighContrast ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            </div>

            {/* Sound */}
            <div className="mb-6">
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-serenity-800">
                  {isSoundEnabled ? <Volume2 className="w-4 h-4 inline mr-2" /> : <VolumeX className="w-4 h-4 inline mr-2" />}
                  Sonidos de Notificación
                </span>
                <button
                  onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isSoundEnabled ? 'bg-serenia-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isSoundEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-serenity-800">Acciones Rápidas</h3>
              
              <button
                onClick={() => document.querySelector('main')?.focus()}
                className="w-full flex items-center justify-start p-3 bg-serenity-50 rounded-lg hover:bg-serenity-100 transition-colors text-sm"
              >
                <Eye className="w-4 h-4 mr-3 text-serenity-600" />
                Ir al contenido principal
              </button>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full flex items-center justify-start p-3 bg-serenity-50 rounded-lg hover:bg-serenity-100 transition-colors text-sm"
              >
                <Maximize2 className="w-4 h-4 mr-3 text-serenity-600" />
                Ir al inicio de la página
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetSettings}
              className="w-full mt-6 bg-serenity-100 text-serenity-700 py-3 px-4 rounded-lg font-medium hover:bg-serenity-200 transition-colors"
            >
              Restablecer Configuración
            </button>

            {/* Info */}
            <div className="mt-6 p-3 bg-serenia-50 rounded-lg">
              <p className="text-xs text-serenity-600">
                <strong>Tip:</strong> Usa Tab para navegar entre elementos y Enter para activarlos. 
                Presiona Escape para cerrar menús.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}