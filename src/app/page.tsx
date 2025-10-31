import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Heart, MessageCircle, BarChart3, BookOpen, TestTube, Users, ArrowRight, Sparkles, Play } from 'lucide-react'
import { WelcomeGuide, QuickTips } from '@/components/WelcomeGuide'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100">
      {/* Guías para nuevos usuarios */}
      <WelcomeGuide />
      <QuickTips />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Heart className="w-20 h-20 text-serenia-500" />
              <Sparkles className="w-6 h-6 text-serenia-400 absolute -top-2 -right-2" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-serenia-800 mb-4">
            SerenIA
          </h1>
          <p className="text-2xl text-serenity-600 mb-2">
            Tu Asistente de Bienestar Emocional
          </p>
          <p className="text-lg text-serenity-500 max-w-2xl mx-auto mb-8">
            Encuentra paz interior, crecimiento personal y apoyo espiritual 
            con la ayuda de inteligencia artificial y principios cristianos
          </p>
          
          {!session ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/auth/signin"
                  className="bg-serenia-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-serenia-700 transition-all hover:scale-105 flex items-center justify-center shadow-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Comenzar Ahora
                </Link>
                <Link 
                  href="/demo"
                  className="border-2 border-serenia-600 text-serenia-600 px-8 py-4 rounded-xl font-semibold hover:bg-serenia-50 transition-all flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Probar Chat Demo
                </Link>
              </div>
              
              {/* Demo Credentials Card */}
              <div className="bg-white/80 backdrop-blur rounded-xl p-6 max-w-md mx-auto border border-serenia-200 shadow-lg">
                <h3 className="font-semibold text-serenity-800 mb-3">🔑 Acceso Demo Rápido</h3>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between items-center p-2 bg-serenia-50 rounded">
                    <span className="text-serenity-600">Usuario:</span>
                    <code className="text-serenia-700">maria@demo.com</code>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-serenia-50 rounded">
                    <span className="text-serenity-600">Contraseña:</span>
                    <code className="text-serenia-700">demo123</code>
                  </div>
                </div>
                <Link 
                  href="/auth/signin"
                  className="text-xs text-serenia-600 hover:text-serenia-700 underline mt-2 block text-center"
                >
                  Usar credenciales demo →
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur rounded-xl p-8 shadow-xl max-w-md mx-auto border border-serenia-200">
              <div className="text-4xl mb-4">👋</div>
              <h2 className="text-xl font-semibold text-serenity-800 mb-2">
                ¡Hola, {session.user?.name?.split(' ')[0] || 'Hermano/a'}!
              </h2>
              <p className="text-serenity-600 mb-6">¿Cómo te sientes hoy?</p>
              <div className="space-y-3">
                <Link 
                  href="/dashboard"
                  className="w-full bg-serenia-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-serenia-700 transition-colors flex items-center justify-center"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Ver Mi Progreso
                </Link>
                <Link 
                  href="/chat"
                  className="w-full border-2 border-serenia-600 text-serenia-600 px-6 py-3 rounded-lg font-semibold hover:bg-serenia-50 transition-colors flex items-center justify-center"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Conversar con SerenIA
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Quick Features - Simple Icons */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center text-serenity-800 mb-12">
            ¿Cómo te ayudo hoy?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Chat Feature */}
            <Link href="/chat" className="group">
              <div className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-serenia-100">
                <div className="w-16 h-16 bg-serenia-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-serenia-200 transition-colors">
                  <MessageCircle className="w-8 h-8 text-serenia-600" />
                </div>
                <h3 className="text-xl font-semibold text-serenity-800 mb-3">
                  Conversar
                </h3>
                <p className="text-serenity-600">
                  Habla con SerenIA sobre tus sentimientos, preocupaciones o necesidades espirituales
                </p>
              </div>
            </Link>

            {/* Mood Feature */}
            <Link href="/mood" className="group">
              <div className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-serenia-100">
                <div className="w-16 h-16 bg-serenia-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-serenia-200 transition-colors">
                  <Heart className="w-8 h-8 text-serenia-600" />
                </div>
                <h3 className="text-xl font-semibold text-serenity-800 mb-3">
                  Mi Estado de Ánimo
                </h3>
                <p className="text-serenity-600">
                  Registra cómo te sientes y observa patrones en tu bienestar emocional
                </p>
              </div>
            </Link>

            {/* Verses Feature */}
            <Link href="/verses" className="group">
              <div className="bg-white rounded-2xl p-8 text-center hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-serenia-100">
                <div className="w-16 h-16 bg-serenia-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-serenia-200 transition-colors">
                  <BookOpen className="w-8 h-8 text-serenia-600" />
                </div>
                <h3 className="text-xl font-semibold text-serenity-800 mb-3">
                  Versículos
                </h3>
                <p className="text-serenity-600">
                  Encuentra versículos bíblicos que hablen a tu corazón y situación actual
                </p>
              </div>
            </Link>

          </div>
        </section>

        {/* More Features - Collapsed by default */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-serenity-800 mb-4">
              Explora Más Herramientas
            </h3>
            <p className="text-serenity-600">
              Descubre todas las formas en que SerenIA puede acompañarte
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            
            <Link href="/tests" className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow border border-gray-100">
              <TestTube className="w-10 h-10 text-serenia-500 mb-3" />
              <h4 className="font-semibold text-serenity-800 mb-2">Evaluaciones</h4>
              <p className="text-sm text-serenity-600">Tests de bienestar y crecimiento personal</p>
            </Link>

            <Link href="/dashboard" className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow border border-gray-100">
              <BarChart3 className="w-10 h-10 text-serenia-500 mb-3" />
              <h4 className="font-semibold text-serenity-800 mb-2">Mi Progreso</h4>
              <p className="text-sm text-serenity-600">Visualiza tu crecimiento y metas</p>
            </Link>

            <Link href="/community" className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow border border-gray-100">
              <Users className="w-10 h-10 text-serenia-500 mb-3" />
              <h4 className="font-semibold text-serenity-800 mb-2">Comunidad</h4>
              <p className="text-sm text-serenity-600">Comparte y recibe apoyo mutuo</p>
            </Link>

          </div>
        </section>

        {/* Emergency Help - Simplified */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-red-800 mb-2">
                  ¿Necesitas ayuda inmediata?
                </h3>
                <p className="text-red-700 mb-3">
                  Si estás en crisis, no estás solo. Busca ayuda profesional:
                </p>
                <div className="flex gap-4 text-sm">
                  <span className="bg-white px-3 py-1 rounded font-medium text-red-800">
                    Crisis: 988
                  </span>
                  <span className="bg-white px-3 py-1 rounded font-medium text-red-800">
                    Emergencia: 911
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-serenity-500 pt-8 border-t border-serenity-200">
          <p>SerenIA &copy; 2025 • Desarrollado con ❤️ para tu bienestar</p>
        </footer>
      </div>
    </main>
  )
}