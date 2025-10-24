'use client'

import { Navigation } from '@/components/Navigation'
import { 
  Heart, 
  Users, 
  Key, 
  Copy, 
  ArrowRight,
  User,
  Mail,
  Lock
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const demoUsers = [
  {
    id: 1,
    name: 'María González',
    email: 'maria@demo.com',
    password: 'demo123',
    role: 'Usuario Regular',
    description: 'Usuaria activa de la comunidad, comparte testimonios y participa en discusiones.',
    avatar: '👩‍💼'
  },
  {
    id: 2,
    name: 'Carlos Ramírez',
    email: 'carlos@demo.com',
    password: 'demo123',
    role: 'Usuario Moderador',
    description: 'Moderador de la comunidad, ayuda a otros usuarios y comparte reflexiones.',
    avatar: '👨‍🏫'
  },
  {
    id: 3,
    name: 'Ana Sofía López',
    email: 'ana@demo.com',
    password: 'demo123',
    role: 'Usuario Nuevo',
    description: 'Nueva en la plataforma, busca apoyo espiritual y emocional.',
    avatar: '👩‍🎓'
  }
]

export default function CredentialsPage() {
  const [copiedUser, setCopiedUser] = useState<number | null>(null)

  const copyCredentials = (user: typeof demoUsers[0]) => {
    const credentials = `Email: ${user.email}\nContraseña: ${user.password}`
    navigator.clipboard.writeText(credentials)
    setCopiedUser(user.id)
    setTimeout(() => setCopiedUser(null), 2000)
  }

  const copyToInput = (text: string, type: 'email' | 'password') => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Key className="w-12 h-12 text-serenia-500 mr-3" />
            <h1 className="text-4xl font-bold text-serenia-800">Credenciales Demo</h1>
          </div>
          <p className="text-xl text-serenity-600 max-w-3xl mx-auto">
            Usa estas credenciales para probar SerenIA con funcionalidades completas
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
          <div className="flex items-center mb-3">
            <Users className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-blue-800">Instrucciones</h3>
          </div>
          <ol className="text-blue-700 space-y-2">
            <li>1. Elige uno de los usuarios demo de abajo</li>
            <li>2. Copia las credenciales o haz clic en "Iniciar Sesión Directo"</li>
            <li>3. Explora todas las funcionalidades con datos guardados</li>
            <li>4. Cada usuario tiene un perfil y datos únicos</li>
          </ol>
        </div>

        {/* Demo Users */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {demoUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              {/* Avatar & Name */}
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-serenia-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                  {user.avatar}
                </div>
                <h3 className="text-xl font-semibold text-serenity-800">{user.name}</h3>
                <p className="text-sm text-serenia-600 font-medium">{user.role}</p>
              </div>

              {/* Description */}
              <p className="text-serenity-600 text-sm mb-6 text-center">
                {user.description}
              </p>

              {/* Credentials */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between bg-serenity-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-serenity-500 mr-2" />
                    <span className="text-sm font-mono">{user.email}</span>
                  </div>
                  <button
                    onClick={() => copyToInput(user.email, 'email')}
                    className="text-serenia-600 hover:text-serenia-700"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between bg-serenity-50 rounded-lg p-3">
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 text-serenity-500 mr-2" />
                    <span className="text-sm font-mono">{user.password}</span>
                  </div>
                  <button
                    onClick={() => copyToInput(user.password, 'password')}
                    className="text-serenia-600 hover:text-serenia-700"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Link
                  href={`/auth/signin?email=${user.email}&password=${user.password}`}
                  className="w-full bg-serenia-600 text-white py-3 rounded-lg font-medium hover:bg-serenia-700 transition-colors flex items-center justify-center"
                >
                  <User className="w-4 h-4 mr-2" />
                  Iniciar Sesión Directo
                </Link>

                <button
                  onClick={() => copyCredentials(user)}
                  className={`w-full border border-serenia-300 py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${
                    copiedUser === user.id
                      ? 'bg-green-50 text-green-700 border-green-300'
                      : 'text-serenia-700 hover:bg-serenia-50'
                  }`}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copiedUser === user.id ? '¡Copiado!' : 'Copiar Credenciales'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Access */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-serenity-800 mb-4">
              Acceso Rápido
            </h2>
            <p className="text-serenity-600 mb-6">
              ¿Quieres ir directo a iniciar sesión? Usa cualquiera de estas credenciales.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Link 
                href="/auth/signin"
                className="bg-serenia-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-serenia-700 transition-colors inline-flex items-center justify-center"
              >
                <ArrowRight className="w-5 h-5 mr-2" />
                Ir a Iniciar Sesión
              </Link>
              <Link 
                href="/demo"
                className="border border-serenia-300 text-serenia-700 px-6 py-3 rounded-lg font-semibold hover:bg-serenia-50 transition-colors inline-flex items-center justify-center"
              >
                Continuar en Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}