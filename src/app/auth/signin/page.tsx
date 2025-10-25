'use client'

import { useState, useEffect, Suspense } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Heart, Mail, Lock, User, Eye, EyeOff, ArrowRight, Key } from 'lucide-react'

function SignInForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  // Auto-fill credentials from URL parameters
  useEffect(() => {
    const urlEmail = searchParams.get('email')
    const urlPassword = searchParams.get('password')
    
    if (urlEmail) setEmail(urlEmail)
    if (urlPassword) setPassword(urlPassword)
  }, [searchParams])

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    console.log('Frontend: Attempting login with:', { email, password, mode })

    try {
      const result = await signIn('credentials', {
        email,
        password,
        mode: mode || 'signin', // Asegurar que siempre hay un modo
        name: mode === 'signup' ? name : '',
        redirect: false
      })

      console.log('Frontend: SignIn result:', result)

      if (result?.error) {
        setError(result.error)
        console.error('Frontend: SignIn error:', result.error)
      } else {
        // Verificar la sesión y redirigir
        const session = await getSession()
        console.log('Frontend: Session after login:', session)
        if (session) {
          router.push('/dashboard')
        }
      }
    } catch (error) {
      setError('Ocurrió un error inesperado')
      console.error('Frontend: Auth error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')
    
    try {
      const result = await signIn('google', { 
        callbackUrl: '/dashboard',
        redirect: false 
      })
      
      if (result?.error) {
        if (result.error === 'OAuthCallback') {
          setError('Error de configuración OAuth. Por favor, contacta al administrador.')
        } else if (result.error === 'AccessDenied') {
          setError('Acceso denegado. Verifica que tengas permisos para usar esta aplicación.')
        } else {
          setError('Error al iniciar sesión con Google. Intenta de nuevo.')
        }
      } else if (result?.url) {
        router.push(result.url)
      }
    } catch (error) {
      setError('Error de conexión. Verifica tu internet e intenta de nuevo.')
      console.error('Google sign in error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-serenia-500 mr-3" />
            <h1 className="text-3xl font-bold text-serenia-800">SerenIA</h1>
          </Link>
          <h2 className="text-2xl font-semibold text-serenity-800 mb-2">
            {mode === 'signin' ? 'Bienvenido de vuelta' : 'Únete a SerenIA'}
          </h2>
          <p className="text-serenity-600">
            {mode === 'signin' 
              ? 'Inicia sesión para continuar tu viaje de bienestar'
              : 'Comienza tu viaje hacia el bienestar emocional'
            }
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Mode Toggle */}
          <div className="flex rounded-lg bg-serenity-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === 'signin'
                  ? 'bg-white text-serenia-600 shadow-sm'
                  : 'text-serenity-600 hover:text-serenity-800'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === 'signup'
                  ? 'bg-white text-serenia-600 shadow-sm'
                  : 'text-serenity-600 hover:text-serenity-800'
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleCredentialsSubmit} className="space-y-4 mb-6">
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-serenity-700 mb-2">
                  Nombre completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-serenity-400 w-4 h-4" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-serenity-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-serenia-500 focus:border-transparent"
                    placeholder="Tu nombre completo"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-serenity-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-serenity-400 w-4 h-4" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-serenity-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-serenia-500 focus:border-transparent"
                  placeholder="tu@email.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-serenity-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-serenity-400 w-4 h-4" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-serenity-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-serenia-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-serenity-400 hover:text-serenity-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === 'signup' && (
                <p className="text-xs text-serenity-500 mt-1">
                  Mínimo 6 caracteres
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-serenia-600 text-white py-3 rounded-lg font-medium hover:bg-serenia-700 focus:outline-none focus:ring-2 focus:ring-serenia-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {mode === 'signin' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Quick Access */}
          {mode === 'signin' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center mb-2">
                <Key className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Credenciales Demo</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('maria@demo.com')
                    setPassword('demo123')
                  }}
                  className="bg-white border border-blue-300 rounded px-2 py-1 hover:bg-blue-50 transition-colors"
                >
                  María
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('carlos@demo.com')
                    setPassword('demo123')
                  }}
                  className="bg-white border border-blue-300 rounded px-2 py-1 hover:bg-blue-50 transition-colors"
                >
                  Carlos
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('ana@demo.com')
                    setPassword('demo123')
                  }}
                  className="bg-white border border-blue-300 rounded px-2 py-1 hover:bg-blue-50 transition-colors"
                >
                  Ana
                </button>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Haz clic para auto-completar • Contraseña: demo123
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-serenity-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-serenity-500">o continúa con</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white border border-serenity-300 text-serenity-700 py-3 rounded-lg font-medium hover:bg-serenity-50 focus:outline-none focus:ring-2 focus:ring-serenia-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          {/* Footer */}
          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="text-sm text-serenity-600 hover:text-serenia-600 transition-colors"
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-serenity-500 mt-6">
          Al {mode === 'signin' ? 'iniciar sesión' : 'registrarte'}, aceptas nuestros{' '}
          <Link href="/terms" className="text-serenia-600 hover:underline">
            Términos de Servicio
          </Link>{' '}
          y{' '}
          <Link href="/privacy" className="text-serenia-600 hover:underline">
            Política de Privacidad
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SignInForm />
    </Suspense>
  )
}