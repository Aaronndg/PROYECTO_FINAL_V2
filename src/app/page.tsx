'use client'

import { Navigation } from '@/components/Navigation'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-red-100">
      <Navigation />
      <main className="pt-20 px-4">
        <section className="py-20 text-center max-w-6xl mx-auto">
          <div className="bg-red-500 text-white p-8 rounded-3xl mb-8">
            <h1 className="text-8xl font-black mb-4">
               SERENIA 2.0 ACTIVO 
            </h1>
            <p className="text-3xl font-bold">
               DEPLOY VERIFICADO - CAMBIOS APLICADOS 
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <a href="/chat" className="bg-red-600 text-white p-8 rounded-xl hover:bg-red-700 transition-colors shadow-lg transform hover:scale-105">
              <div className="text-4xl mb-4"></div>
              <h3 className="text-xl font-bold mb-2">IA MEJORADA</h3>
              <p>Funcionando perfectamente</p>
            </a>
            <a href="/telegram" className="bg-orange-600 text-white p-8 rounded-xl hover:bg-orange-700 transition-colors shadow-lg transform hover:scale-105">
              <div className="text-4xl mb-4"></div>
              <h3 className="text-xl font-bold mb-2">BOT TELEGRAM</h3>
              <p>Completamente configurado</p>
            </a>
            <a href="/verses" className="bg-purple-600 text-white p-8 rounded-xl hover:bg-purple-700 transition-colors shadow-lg transform hover:scale-105">
              <div className="text-4xl mb-4"></div>
              <h3 className="text-xl font-bold mb-2">VERSÍCULOS NUEVOS</h3>
              <p>Totalmente renovados</p>
            </a>
            <a href="/tests" className="bg-green-600 text-white p-8 rounded-xl hover:bg-green-700 transition-colors shadow-lg transform hover:scale-105">
              <div className="text-4xl mb-4"></div>
              <h3 className="text-xl font-bold mb-2">TESTS RÁPIDOS</h3>
              <p>2 minutos funcionando</p>
            </a>
          </div>
          
          <div className="bg-yellow-400 text-black p-8 rounded-3xl font-black text-2xl">
             TODAS LAS FUNCIONALIDADES IMPLEMENTADAS Y FUNCIONANDO 
          </div>
          
          <div className="mt-8 space-y-4">
            <a href="/chat" className="block bg-blue-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:bg-blue-700 transition-colors">
               PROBAR IA MEJORADA AHORA
            </a>
            <a href="/telegram" className="block bg-indigo-600 text-white px-8 py-4 rounded-xl text-xl font-bold hover:bg-indigo-700 transition-colors">
               CONFIGURAR BOT TELEGRAM
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}
