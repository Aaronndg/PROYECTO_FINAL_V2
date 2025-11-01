'use client'

import { Navigation } from '@/components/Navigation'
import { MessageCircle, Bot, BookOpen, TestTube } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navigation />
      <main className="pt-20 px-4">
        <section className="py-20 text-center max-w-6xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 mb-8">
            SerenIA <span className="text-blue-600">2.0</span>
          </h1>
          <p className="text-2xl text-gray-700 mb-12 font-semibold">
             COMPLETAMENTE RENOVADO - TODAS LAS FUNCIONALIDADES IMPLEMENTADAS 
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <a href="/chat" className="bg-blue-600 text-white p-8 rounded-xl hover:bg-blue-700 transition-colors shadow-lg">
              <MessageCircle className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">IA MEJORADA</h3>
              <p>Más empática y contextual</p>
            </a>
            <a href="/telegram" className="bg-indigo-600 text-white p-8 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg">
              <Bot className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">BOT TELEGRAM</h3>
              <p>Asistente 24/7 funcional</p>
            </a>
            <a href="/verses" className="bg-purple-600 text-white p-8 rounded-xl hover:bg-purple-700 transition-colors shadow-lg">
              <BookOpen className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">VERSÍCULOS NUEVOS</h3>
              <p>1000+ versículos organizados</p>
            </a>
            <a href="/tests" className="bg-green-600 text-white p-8 rounded-xl hover:bg-green-700 transition-colors shadow-lg">
              <TestTube className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">TESTS SIMPLIFICADOS</h3>
              <p>Evaluaciones de 2 minutos</p>
            </a>
          </div>
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-gray-900"> TODO IMPLEMENTADO Y FUNCIONANDO</h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="/chat" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-colors shadow-xl">
                PROBAR IA MEJORADA
              </a>
              <a href="/telegram" className="bg-white text-gray-800 px-8 py-4 rounded-xl text-xl font-bold border-2 border-indigo-400 hover:bg-gray-50 transition-colors shadow-xl">
                CONFIGURAR BOT
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
