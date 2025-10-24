'use client'

import { Navigation } from '@/components/Navigation'
import { 
  Heart, 
  MessageCircle, 
  BarChart3, 
  BookOpen, 
  TestTube, 
  Users, 
  ArrowRight,
  Star
} from 'lucide-react'
import Link from 'next/link'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-12 h-12 text-serenia-500 mr-3" />
            <h1 className="text-4xl font-bold text-serenia-800">Demo de SerenIA</h1>
          </div>
          <p className="text-xl text-serenity-600 max-w-3xl mx-auto">
            Explora las funcionalidades de SerenIA sin necesidad de registrarte
          </p>
        </div>

        {/* Demo Alert */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
          <div className="flex items-center">
            <Star className="w-5 h-5 text-yellow-600 mr-2" />
            <p className="text-yellow-800">
              <strong>Modo Demo:</strong> Puedes explorar todas las funcionalidades. Para guardar tu progreso, 
              <Link href="/auth/signin" className="text-yellow-900 underline ml-1">
                crea una cuenta gratuita
              </Link>.
            </p>
          </div>
        </div>

        {/* Demo Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Versículos */}
          <Link href="/verses" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow block">
            <BookOpen className="w-12 h-12 text-serenia-500 mb-4" />
            <h3 className="text-xl font-semibold text-serenity-800 mb-3">
              Versículos Bíblicos
            </h3>
            <p className="text-serenity-600 mb-4">
              Explora versículos personalizados y búsqueda por temas
            </p>
            <div className="flex items-center text-serenia-600">
              <span>Explorar versículos</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </Link>

          {/* Tests */}
          <Link href="/tests" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow block">
            <TestTube className="w-12 h-12 text-serenia-500 mb-4" />
            <h3 className="text-xl font-semibold text-serenity-800 mb-3">
              Tests de Bienestar
            </h3>
            <p className="text-serenity-600 mb-4">
              Evaluaciones psicológicas y espirituales completas
            </p>
            <div className="flex items-center text-serenia-600">
              <span>Realizar test</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </Link>

          {/* Chat Demo */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <MessageCircle className="w-12 h-12 text-serenia-500 mb-4" />
            <h3 className="text-xl font-semibold text-serenity-800 mb-3">
              Chat con IA
            </h3>
            <p className="text-serenity-600 mb-4">
              Conversa con SerenIA sobre temas de fe y bienestar
            </p>
            <button className="flex items-center text-serenia-600 hover:text-serenia-700 transition-colors">
              <span>Próximamente</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>

          {/* Community */}
          <Link href="/community" className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow block">
            <Users className="w-12 h-12 text-serenia-500 mb-4" />
            <h3 className="text-xl font-semibold text-serenity-800 mb-3">
              Comunidad
            </h3>
            <p className="text-serenity-600 mb-4">
              Lee testimonios y reflexiones de la comunidad
            </p>
            <div className="flex items-center text-serenia-600">
              <span>Ver comunidad</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </Link>

          {/* Dashboard Demo */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <BarChart3 className="w-12 h-12 text-serenia-500 mb-4" />
            <h3 className="text-xl font-semibold text-serenity-800 mb-3">
              Dashboard Personal
            </h3>
            <p className="text-serenity-600 mb-4">
              Visualiza métricas de progreso y bienestar
            </p>
            <Link href="/auth/signin" className="flex items-center text-serenia-600 hover:text-serenia-700 transition-colors">
              <span>Requiere cuenta</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {/* Telegram */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <MessageCircle className="w-12 h-12 text-serenia-500 mb-4" />
            <h3 className="text-xl font-semibold text-serenity-800 mb-3">
              Bot de Telegram
            </h3>
            <p className="text-serenity-600 mb-4">
              Configura notificaciones y recordatorios
            </p>
            <Link href="/auth/signin" className="flex items-center text-serenia-600 hover:text-serenia-700 transition-colors">
              <span>Requiere cuenta</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-serenity-800 mb-4">
              ¿Te gusta lo que ves?
            </h2>
            <p className="text-serenity-600 mb-6">
              Registrate gratis para acceder a todas las funcionalidades, guardar tu progreso y personalizar tu experiencia.
            </p>
            <Link 
              href="/auth/signin"
              className="bg-serenia-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-serenia-700 transition-colors inline-flex items-center"
            >
              Crear cuenta gratuita
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}