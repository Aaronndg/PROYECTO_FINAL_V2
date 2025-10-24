import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Heart, MessageCircle, BarChart3, BookOpen, TestTube, Users, ArrowRight } from 'lucide-react'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Heart className="w-16 h-16 text-serenia-500 mr-4" />
            <h1 className="text-5xl font-bold text-serenia-800">
              SerenIA
            </h1>
          </div>
          <p className="text-xl text-serenity-600 max-w-3xl mx-auto mb-8">
            Tu asistente emocional y de bienestar, guiado por principios cristianos.
            Encuentra paz, crecimiento personal y comunidad en un solo lugar.
          </p>
          
          {!session ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/signin"
                className="bg-serenia-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-serenia-700 transition-colors flex items-center justify-center"
              >
                Comenzar mi viaje
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link 
                href="/demo"
                className="border-2 border-serenia-600 text-serenia-600 px-8 py-3 rounded-lg font-semibold hover:bg-serenia-50 transition-colors"
              >
                Probar sin registro
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 shadow-lg max-w-md mx-auto">
              <p className="text-serenity-700 mb-4">
                ¡Bienvenido de vuelta, {session.user?.name}!
              </p>
              <Link 
                href="/dashboard"
                className="bg-serenia-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-serenia-700 transition-colors inline-flex items-center"
              >
                Ir a mi dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          )}
        </header>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Mood Tracking */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <Heart className="w-12 h-12 text-serenia-500 mb-4" />
            <h3 className="text-xl font-semibold text-serenity-800 mb-3">
              Seguimiento Emocional
            </h3>
            <p className="text-serenity-600 mb-4">
              Registra tu estado de ánimo diario y observa patrones que te ayuden a crecer emocionalmente.
            </p>
            <ul className="text-sm text-serenity-500 space-y-1">
              <li>• Análisis de tendencias con IA</li>
              <li>• Insights personalizados</li>
              <li>• Recordatorios diarios</li>
            </ul>
          </div>

          {/* AI Chat */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <MessageCircle className="w-12 h-12 text-serenia-500 mb-4" />
            <h3 className="text-xl font-semibold text-serenity-800 mb-3">
              Chat con IA Empática
            </h3>
            <p className="text-serenity-600 mb-4">
              Conversa con SerenIA, tu asistente de IA entrenado en principios cristianos de bienestar.
            </p>
            <ul className="text-sm text-serenity-500 space-y-1">
              <li>• Respuestas contextuales</li>
              <li>• Detección de riesgo</li>
              <li>• Recursos bíblicos</li>
            </ul>
          </div>

          {/* Scripture */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <BookOpen className="w-12 h-12 text-serenia-500 mb-4" />
            <h3 className="text-xl font-semibold text-serenity-800 mb-3">
              Versículos Diarios
            </h3>
            <p className="text-serenity-600 mb-4">
              Recibe versículos bíblicos personalizados según tu estado emocional y necesidades.
            </p>
            <ul className="text-sm text-serenity-500 space-y-1">
              <li>• Versículo del día</li>
              <li>• Búsqueda por tema</li>
              <li>• Favoritos personales</li>
            </ul>
          </div>

          {/* Assessments */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <TestTube className="w-12 h-12 text-serenia-500 mb-4" />
            <h3 className="text-xl font-semibold text-serenity-800 mb-3">
              Evaluaciones Espirituales
            </h3>
            <p className="text-serenity-600 mb-4">
              Tests psicológicos y espirituales para conocerte mejor y recibir orientación personalizada.
            </p>
            <ul className="text-sm text-serenity-500 space-y-1">
              <li>• Test de bienestar emocional</li>
              <li>• Evaluación de fortalezas</li>
              <li>• Personalidad cristiana</li>
            </ul>
          </div>

          {/* Progress Tracking */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <BarChart3 className="w-12 h-12 text-serenia-500 mb-4" />
            <h3 className="text-xl font-semibold text-serenity-800 mb-3">
              Dashboard Personal
            </h3>
            <p className="text-serenity-600 mb-4">
              Visualiza tu progreso, establece metas y celebra tus logros en el camino del bienestar.
            </p>
            <ul className="text-sm text-serenity-500 space-y-1">
              <li>• Métricas de progreso</li>
              <li>• Metas personalizadas</li>
              <li>• Reportes semanales</li>
            </ul>
          </div>

          {/* Community */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <Users className="w-12 h-12 text-serenia-500 mb-4" />
            <h3 className="text-xl font-semibold text-serenity-800 mb-3">
              Comunidad de Apoyo
            </h3>
            <p className="text-serenity-600 mb-4">
              Comparte experiencias y encuentra apoyo en una comunidad cristiana de crecimiento mutuo.
            </p>
            <ul className="text-sm text-serenity-500 space-y-1">
              <li>• Testimonios inspiradores</li>
              <li>• Reflexiones compartidas</li>
              <li>• Apoyo mutuo</li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        {!session && (
          <div className="bg-gradient-to-r from-serenia-600 to-serenia-700 rounded-xl p-8 text-center text-white mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Comienza tu viaje hacia el bienestar hoy
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Únete a miles de personas que han encontrado paz y crecimiento con SerenIA
            </p>
            <Link 
              href="/auth/signin"
              className="bg-white text-serenia-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              Registrarse gratis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        )}

        {/* Emergency Section */}
        <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800 mb-2">
                ¿Necesitas ayuda inmediata?
              </h3>
              <p className="text-red-700 mb-4">
                Si estás pasando por una crisis emocional, no estás solo. Busca ayuda profesional:
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white p-3 rounded-lg">
                  <p className="font-medium text-red-800">Línea de Crisis</p>
                  <p className="text-red-600">1-800-273-8255</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="font-medium text-red-800">Emergencias</p>
                  <p className="text-red-600">911</p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="font-medium text-red-800">Crisis Text</p>
                  <p className="text-red-600">&ldquo;HOME&rdquo; al 741741</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-serenity-500">
          <p>&copy; 2025 SerenIA. Desarrollado con ❤️ para el bienestar de la comunidad cristiana.</p>
        </footer>
      </div>
    </main>
  )
}