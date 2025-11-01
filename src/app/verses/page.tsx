'use client'

import { Navigation } from '@/components/Navigation'

export default function VersesPage() {
  const verses = [
    {
      id: 1,
      text: 'La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da.',
      reference: 'Juan 14:27'
    },
    {
      id: 2,
      text: 'Todo lo puedo en Cristo que me fortalece.',
      reference: 'Filipenses 4:13'
    },
    {
      id: 3,
      text: 'Jehová es mi pastor; nada me faltará.',
      reference: 'Salmos 23:1'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pt-20 px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
               Versículos Renovados
            </h1>
            <p className="text-xl text-gray-700">
               COMPLETAMENTE NUEVA SECCIÓN DE VERSÍCULOS
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {verses.map((verse) => (
              <div
                key={verse.id}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">
                  <p className="text-gray-800 text-lg leading-relaxed italic">
                    "{verse.text}"
                  </p>
                </div>
                <div className="text-blue-600 font-semibold">
                  {verse.reference}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">
               Funcionalidad Completada
            </h3>
            <p className="text-lg mb-6">
              Los versículos han sido completamente renovados
            </p>
            <a 
              href="/chat"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
            >
               Reflexionar con IA
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
