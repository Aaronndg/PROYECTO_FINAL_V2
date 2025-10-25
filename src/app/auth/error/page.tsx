'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Heart, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { Suspense } from 'react'

const errorMessages = {
  Configuration: 'Error de configuración del servidor. Contacta al administrador.',
  AccessDenied: 'Acceso denegado. No tienes permisos para acceder a esta aplicación.',
  Verification: 'Token de verificación inválido o expirado.',
  Default: 'Error de autenticación. Intenta iniciar sesión de nuevo.',
  OAuthSignin: 'Error al iniciar el proceso de OAuth.',
  OAuthCallback: 'Error en el callback de OAuth. Verifica la configuración.',
  OAuthCreateAccount: 'No se pudo crear la cuenta con OAuth.',
  EmailCreateAccount: 'No se pudo crear la cuenta con email.',
  Callback: 'Error en el callback de autenticación.',
  OAuthAccountNotLinked: 'Esta cuenta OAuth no está vinculada. Usa otro método de inicio de sesión.',
  EmailSignin: 'No se pudo enviar el email de verificación.',
  CredentialsSignin: 'Credenciales inválidas. Verifica tu email y contraseña.',
  SessionRequired: 'Debes iniciar sesión para acceder a esta página.'
}

function AuthErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') as keyof typeof errorMessages
  
  const errorMessage = errorMessages[error] || errorMessages.Default
  
  const getErrorDetails = (error: string) => {
    switch (error) {
      case 'OAuthCallback':
        return {
          title: 'Error de configuración OAuth',
          description: 'Esto suele ocurrir cuando las URLs de redirect no están configuradas correctamente en Google Console.',
          solutions: [
            'Verifica que los URLs de redirect estén configurados en Google Cloud Console',
            'Asegúrate de que las variables de entorno GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET estén configuradas',
            'Contacta al administrador si el problema persiste'
          ]
        }
      case 'AccessDenied':
        return {
          title: 'Acceso denegado',
          description: 'La aplicación está en modo desarrollo y solo permite usuarios específicos.',
          solutions: [
            'Contacta al administrador para ser agregado como usuario de prueba',
            'Usa el modo demo para explorar la aplicación',
            'Intenta con una cuenta diferente'
          ]
        }
      case 'OAuthAccountNotLinked':
        return {
          title: 'Cuenta no vinculada',
          description: 'Ya existe una cuenta con este email usando un método diferente.',
          solutions: [
            'Intenta iniciar sesión con email y contraseña',
            'O usa el mismo método OAuth que usaste anteriormente',
            'Contacta soporte si necesitas vincular las cuentas'
          ]
        }
      default:
        return {
          title: 'Error de autenticación',
          description: 'Ocurrió un error durante el proceso de autenticación.',
          solutions: [
            'Intenta iniciar sesión de nuevo',
            'Verifica tu conexión a internet',
            'Usa el modo demo si quieres explorar la aplicación'
          ]
        }
    }
  }
  
  const errorDetails = getErrorDetails(error)

  return (
    <div className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-serenia-500 mr-3" />
            <h1 className="text-3xl font-bold text-serenia-800">SerenIA</h1>
          </Link>
        </div>

        {/* Error Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {errorDetails.title}
            </h2>
            <p className="text-gray-600 text-sm">
              {errorDetails.description}
            </p>
          </div>

          {/* Error Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm font-medium">
              {errorMessage}
            </p>
            {error && (
              <p className="text-red-600 text-xs mt-1">
                Código de error: {error}
              </p>
            )}
          </div>

          {/* Solutions */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-800 mb-3">Qué puedes hacer:</h3>
            <ul className="space-y-2">
              {errorDetails.solutions.map((solution, index) => (
                <li key={index} className="flex items-start text-sm text-gray-600">
                  <span className="w-2 h-2 bg-serenia-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {solution}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="w-full bg-serenia-600 text-white py-3 rounded-lg font-medium hover:bg-serenia-700 transition-colors flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Intentar de nuevo
            </Link>
            
            <Link
              href="/demo"
              className="w-full border border-serenia-300 text-serenia-700 py-3 rounded-lg font-medium hover:bg-serenia-50 transition-colors flex items-center justify-center"
            >
              Explorar en modo demo
            </Link>
            
            <Link
              href="/"
              className="w-full text-center text-sm text-gray-600 hover:text-serenia-600 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Volver al inicio
            </Link>
          </div>
        </div>

        {/* Help */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            ¿Necesitas ayuda? Contacta a{' '}
            <a href="mailto:soporte@serenia.app" className="text-serenia-600 hover:underline">
              soporte@serenia.app
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <AuthErrorContent />
    </Suspense>
  )
}