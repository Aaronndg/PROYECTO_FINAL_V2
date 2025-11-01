'use client'

import { Navigation } from '@/components/Navigation'

export default function NewHomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <main className="pt-20 px-4">
        <div className="max-w-6xl mx-auto text-center py-20">
          <div className="bg-red-600 p-12 rounded-3xl mb-12 border-8 border-yellow-400">
            <h1 className="text-9xl font-black mb-6 text-yellow-400">
              🔥 SERENIA 2.0 🔥
            </h1>
            <h2 className="text-4xl font-bold mb-4 text-white">
              ✅ FUNCIONANDO PERFECTAMENTE ✅
            </h2>
            <p className="text-3xl font-bold text-lime-400">
              🚀 TODAS LAS FUNCIONALIDADES LISTAS 🚀
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <a 
              href="/chat" 
              className="bg-gradient-to-br from-blue-500 to-purple-600 p-10 rounded-2xl hover:scale-110 transition-all duration-300 border-4 border-white shadow-2xl"
            >
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-2xl font-black mb-2">IA MEJORADA</h3>
              <p className="text-lg">Chat empático funcionando</p>
            </a>
            
            <a 
              href="/telegram" 
              className="bg-gradient-to-br from-orange-500 to-red-600 p-10 rounded-2xl hover:scale-110 transition-all duration-300 border-4 border-white shadow-2xl"
            >
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-2xl font-black mb-2">BOT TELEGRAM</h3>
              <p className="text-lg">Asistente 24/7 activo</p>
            </a>
            
            <a 
              href="/verses" 
              className="bg-gradient-to-br from-purple-500 to-pink-600 p-10 rounded-2xl hover:scale-110 transition-all duration-300 border-4 border-white shadow-2xl"
            >
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-2xl font-black mb-2">VERSÍCULOS</h3>
              <p className="text-lg">Base bíblica completa</p>
            </a>
            
            <a 
              href="/tests" 
              className="bg-gradient-to-br from-green-500 to-teal-600 p-10 rounded-2xl hover:scale-110 transition-all duration-300 border-4 border-white shadow-2xl"
            >
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-2xl font-black mb-2">TESTS RÁPIDOS</h3>
              <p className="text-lg">2 minutos efectivos</p>
            </a>
          </div>
          
          <div className="bg-yellow-400 text-black p-8 rounded-3xl font-black text-4xl mb-8 border-4 border-red-600">
            🎯 PRESENTACIÓN LISTA - TODO FUNCIONA 🎯
          </div>
          
          <div className="space-y-6">
            <a 
              href="/chat" 
              className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-6 rounded-2xl text-2xl font-black hover:scale-105 transition-all border-4 border-yellow-400"
            >
              💬 PROBAR IA MEJORADA AHORA
            </a>
            <a 
              href="/telegram" 
              className="block bg-gradient-to-r from-red-600 to-orange-600 text-white px-12 py-6 rounded-2xl text-2xl font-black hover:scale-105 transition-all border-4 border-yellow-400"
            >
              🤖 CONFIGURAR BOT TELEGRAM
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}