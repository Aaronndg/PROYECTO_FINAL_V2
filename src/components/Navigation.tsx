'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Heart, 
  MessageCircle, 
  BarChart3, 
  BookOpen, 
  TestTube, 
  FileText, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react'

export function Navigation() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/mood', label: 'Estado de Ánimo', icon: Heart },
    { href: '/chat', label: 'Chat con SerenIA', icon: MessageCircle },
    { href: '/verses', label: 'Versículos', icon: BookOpen },
    { href: '/tests', label: 'Tests', icon: TestTube },
    { href: '/community', label: 'Comunidad', icon: Users },
    { href: '/telegram', label: 'Bot Telegram', icon: Settings },
    { href: '/automation', label: 'Automatización', icon: FileText },
  ]

  const isActiveRoute = (href: string) => pathname === href

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <Heart className="h-8 w-8 text-serenia-500" />
              <span className="ml-2 text-xl font-bold text-serenia-800">SerenIA</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActiveRoute(item.href)
                      ? 'text-serenia-600 bg-serenia-50'
                      : 'text-serenity-600 hover:text-serenia-600 hover:bg-serenia-50'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-serenity-800">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-serenity-500">
                  {session?.user?.email}
                </p>
              </div>
              {session?.user?.image && (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              )}
            </div>

            {/* Settings & Logout */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                href="/settings"
                className="p-2 text-serenity-600 hover:text-serenia-600 hover:bg-serenia-50 rounded-md transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Link>
              
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="p-2 text-serenity-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-serenity-600 hover:text-serenia-600 hover:bg-serenia-50"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActiveRoute(item.href)
                      ? 'text-serenia-600 bg-serenia-50'
                      : 'text-serenity-600 hover:text-serenia-600 hover:bg-serenia-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              )
            })}
            
            {/* Mobile User Info */}
            <div className="px-3 py-2 border-t border-gray-200 mt-3">
              <div className="flex items-center space-x-3 mb-3">
                {session?.user?.image && (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-serenity-800">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-serenity-500">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Link
                  href="/settings"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-sm text-serenity-600 hover:text-serenia-600 hover:bg-serenia-50 rounded-md transition-colors"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configuración
                </Link>
                
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    signOut({ callbackUrl: '/' })
                  }}
                  className="flex items-center px-3 py-2 text-sm text-serenity-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}