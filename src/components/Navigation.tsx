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
    { href: '/dashboard', label: 'Inicio', icon: BarChart3, priority: 'high' },
    { href: '/chat', label: 'Chat', icon: MessageCircle, priority: 'high' },
    { href: '/mood', label: 'Mi Estado', icon: Heart, priority: 'high' },
    { href: '/verses', label: 'Versículos', icon: BookOpen, priority: 'medium' },
    { href: '/tests', label: 'Evaluaciones', icon: TestTube, priority: 'medium' },
    { href: '/community', label: 'Comunidad', icon: Users, priority: 'low' },
    { href: '/telegram', label: 'Telegram', icon: Settings, priority: 'low' },
    { href: '/automation', label: 'Automatización', icon: FileText, priority: 'low' },
  ]

  const primaryItems = navigationItems.filter(item => item.priority === 'high')
  const secondaryItems = navigationItems.filter(item => item.priority !== 'high')

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
          <div className="hidden lg:flex items-center space-x-1">
            {/* Primary Navigation */}
            {primaryItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActiveRoute(item.href)
                      ? 'text-white bg-serenia-600 shadow-md'
                      : 'text-serenity-700 hover:text-serenia-700 hover:bg-serenia-50'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              )
            })}
            
            {/* More Menu for Secondary Items */}
            <div className="relative group">
              <button className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-serenity-700 hover:text-serenia-700 hover:bg-serenia-50 transition-all">
                <Settings className="w-4 h-4 mr-1" />
                Más
              </button>
              
              {/* Dropdown */}
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  {secondaryItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center px-4 py-2 text-sm transition-colors ${
                          isActiveRoute(item.href)
                            ? 'text-serenia-600 bg-serenia-50'
                            : 'text-serenity-700 hover:text-serenia-700 hover:bg-serenia-50'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Tablet Navigation */}
          <div className="hidden md:flex lg:hidden items-center space-x-1">
            {primaryItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                    isActiveRoute(item.href)
                      ? 'text-white bg-serenia-600'
                      : 'text-serenity-700 hover:text-serenia-700 hover:bg-serenia-50'
                  }`}
                  title={item.label}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              )
            })}
            
            {/* More button for tablet */}
            <div className="relative group">
              <button className="flex items-center justify-center w-10 h-10 rounded-lg text-serenity-700 hover:text-serenia-700 hover:bg-serenia-50 transition-all">
                <Settings className="w-5 h-5" />
              </button>
              
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  {secondaryItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center px-4 py-2 text-sm transition-colors ${
                          isActiveRoute(item.href)
                            ? 'text-serenia-600 bg-serenia-50'
                            : 'text-serenity-700 hover:text-serenia-700 hover:bg-serenia-50'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            {/* User Info - Desktop Only */}
            <div className="hidden lg:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-serenity-800">
                  {session?.user?.name?.split(' ')[0] || 'Usuario'}
                </p>
                <p className="text-xs text-serenity-500">
                  En línea
                </p>
              </div>
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-serenia-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-serenia-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-serenia-600">
                    {session?.user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="p-2 text-serenity-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-serenity-600 hover:text-serenia-600 hover:bg-serenia-50 transition-colors"
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
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 pt-4 pb-3 space-y-1">
            {/* Primary Items */}
            <div className="space-y-1 mb-4">
              <h3 className="text-xs font-semibold text-serenity-500 uppercase tracking-wider mb-2">
                Principal
              </h3>
              {primaryItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                      isActiveRoute(item.href)
                        ? 'text-white bg-serenia-600'
                        : 'text-serenity-700 hover:text-serenia-700 hover:bg-serenia-50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
            
            {/* Secondary Items */}
            <div className="space-y-1 border-t border-gray-100 pt-4">
              <h3 className="text-xs font-semibold text-serenity-500 uppercase tracking-wider mb-2">
                Herramientas
              </h3>
              {secondaryItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActiveRoute(item.href)
                        ? 'text-serenia-600 bg-serenia-50'
                        : 'text-serenity-600 hover:text-serenia-600 hover:bg-serenia-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
            
            {/* Mobile User Info */}
            <div className="border-t border-gray-100 pt-4 mt-4">
              <div className="flex items-center space-x-3 px-3 py-2 mb-3">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-serenia-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-serenia-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-serenia-600">
                      {session?.user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
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
              
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  signOut({ callbackUrl: '/' })
                }}
                className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}