'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Navigation } from '@/components/Navigation'
import { 
  BookOpen, 
  Heart, 
  Search, 
  Star, 
  Clock, 
  Filter,
  Shuffle,
  Copy,
  Share2,
  X
} from 'lucide-react'

interface Verse {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  created_at: string
  is_favorite?: boolean
}

interface VerseFilter {
  category: string
  emotion: string
  search: string
}

export default function VersesPage() {
  const { data: session } = useSession()
  const [verses, setVerses] = useState<Verse[]>([])
  const [filteredVerses, setFilteredVerses] = useState<Verse[]>([])
  const [dailyVerse, setDailyVerse] = useState<Verse | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null)
  const [demoMode, setDemoMode] = useState(false)
  const [filters, setFilters] = useState<VerseFilter>({
    category: 'all',
    emotion: 'all',
    search: ''
  })

  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'prayer', label: 'Oración' },
    { value: 'meditation', label: 'Meditación' },
    { value: 'mindfulness', label: 'Atención plena' },
    { value: 'breathing', label: 'Respiración' }
  ]

  const emotions = [
    { value: 'all', label: 'Todas las emociones' },
    { value: 'ansiedad', label: 'Ansiedad' },
    { value: 'tristeza', label: 'Tristeza' },
    { value: 'soledad', label: 'Soledad' },
    { value: 'estrés', label: 'Estrés' },
    { value: 'esperanza', label: 'Esperanza' },
    { value: 'gratitud', label: 'Gratitud' },
    { value: 'fortaleza', label: 'Fortaleza' },
    { value: 'paz', label: 'Paz' }
  ]

  // Demo verses data
  const demoVerses: Verse[] = [
    {
      id: 'demo-1',
      title: 'Paz en la tormenta',
      content: 'La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo. - Juan 14:27',
      category: 'paz',
      tags: ['paz', 'ansiedad', 'calma'],
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-2',
      title: 'Fortaleza en la debilidad',
      content: 'Todo lo puedo en Cristo que me fortalece. - Filipenses 4:13',
      category: 'fortaleza',
      tags: ['fortaleza', 'esperanza', 'valor'],
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-3',
      title: 'Amor incondicional',
      content: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna. - Juan 3:16',
      category: 'amor',
      tags: ['amor', 'salvación', 'esperanza'],
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-4',
      title: 'Refugio en tiempos difíciles',
      content: 'Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones. - Salmos 46:1',
      category: 'consuelo',
      tags: ['consuelo', 'refugio', 'fortaleza'],
      created_at: new Date().toISOString()
    },
    {
      id: 'demo-5',
      title: 'Esperanza renovada',
      content: 'Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas. - Isaías 40:31',
      category: 'esperanza',
      tags: ['esperanza', 'renovación', 'fortaleza'],
      created_at: new Date().toISOString()
    }
  ]

  useEffect(() => {
    if (!session) {
      // Demo mode
      setDemoMode(true)
      setVerses(demoVerses)
      setDailyVerse(demoVerses[0])
      setLoading(false)
    } else {
      // Authenticated mode
      setDemoMode(false)
      fetchVerses()
      fetchDailyVerse()
    }
  }, [session])

  useEffect(() => {
    filterVerses()
  }, [verses, filters])

  const fetchVerses = async () => {
    try {
      const response = await fetch('/api/verses')
      if (response.ok) {
        const data = await response.json()
        setVerses(data.verses || [])
      }
    } catch (error) {
      console.error('Error fetching verses:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDailyVerse = async () => {
    try {
      const response = await fetch('/api/verses/daily')
      if (response.ok) {
        const data = await response.json()
        setDailyVerse(data.verse)
      }
    } catch (error) {
      console.error('Error fetching daily verse:', error)
    }
  }

  const filterVerses = () => {
    let filtered = verses

    if (filters.category !== 'all') {
      filtered = filtered.filter(verse => verse.category === filters.category)
    }

    if (filters.emotion !== 'all') {
      filtered = filtered.filter(verse => 
        verse.tags.some(tag => tag.toLowerCase().includes(filters.emotion.toLowerCase()))
      )
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(verse =>
        verse.title.toLowerCase().includes(searchTerm) ||
        verse.content.toLowerCase().includes(searchTerm) ||
        verse.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }

    setFilteredVerses(filtered)
  }

  const toggleFavorite = async (verseId: string) => {
    if (!session) return

    try {
      const response = await fetch(`/api/verses/${verseId}/favorite`, {
        method: 'POST'
      })

      if (response.ok) {
        setVerses(prev => prev.map(verse =>
          verse.id === verseId
            ? { ...verse, is_favorite: !verse.is_favorite }
            : verse
        ))
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const getRandomVerse = () => {
    if (filteredVerses.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredVerses.length)
      setSelectedVerse(filteredVerses[randomIndex])
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Aquí podrías añadir una notificación de éxito
  }

  const shareVerse = (verse: Verse) => {
    if (navigator.share) {
      navigator.share({
        title: verse.title,
        text: verse.content,
        url: window.location.href
      })
    } else {
      copyToClipboard(`${verse.title}: ${verse.content}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-serenia-600 mx-auto mb-4"></div>
              <p className="text-serenity-600">Cargando versículos...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-12 h-12 text-serenia-500 mr-3" />
            <h1 className="text-4xl font-bold text-serenia-800">Versículos Bíblicos</h1>
          </div>
          <p className="text-xl text-serenity-600 max-w-2xl mx-auto">
            Encuentra consuelo, esperanza y dirección en la Palabra de Dios
          </p>
        </div>

        {/* Demo Mode Alert */}
        {demoMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-600 mr-2" />
              <p className="text-yellow-800">
                <strong>Modo Demo:</strong> Explorando versículos de muestra. Para acceder a la biblioteca completa y guardar favoritos,{' '}
                <a href="/auth/signin" className="text-yellow-900 underline">
                  crea una cuenta gratuita
                </a>.
              </p>
            </div>
          </div>
        )}

        {/* Daily Verse Section */}
        {dailyVerse && (
          <div className="bg-gradient-to-r from-serenia-500 to-serenia-600 rounded-xl p-8 text-white mb-8">
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 mr-2" />
              <h2 className="text-2xl font-semibold">Versículo del Día</h2>
            </div>
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-xl font-medium mb-3">{dailyVerse.title}</h3>
              <p className="text-lg leading-relaxed mb-4">{dailyVerse.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {dailyVerse.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/20 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => copyToClipboard(`${dailyVerse.title}: ${dailyVerse.content}`)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => shareVerse(dailyVerse)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  {session && (
                    <button
                      onClick={() => toggleFavorite(dailyVerse.id)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          dailyVerse.is_favorite ? 'fill-yellow-300 text-yellow-300' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 text-serenia-500 mr-2" />
            <h3 className="text-lg font-semibold text-serenity-800">Filtros</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-serenity-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar versículos..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-serenity-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-serenia-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-4 py-2 border border-serenity-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-serenia-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Emotion Filter */}
            <select
              value={filters.emotion}
              onChange={(e) => setFilters(prev => ({ ...prev, emotion: e.target.value }))}
              className="px-4 py-2 border border-serenity-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-serenia-500"
            >
              {emotions.map(emotion => (
                <option key={emotion.value} value={emotion.value}>
                  {emotion.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-serenity-600">
              {filteredVerses.length} versículos encontrados
            </p>
            <button
              onClick={getRandomVerse}
              className="flex items-center px-4 py-2 bg-serenia-100 text-serenia-700 rounded-lg hover:bg-serenia-200 transition-colors"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Versículo aleatorio
            </button>
          </div>
        </div>

        {/* Verses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVerses.map((verse) => (
            <div
              key={verse.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedVerse(verse)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-serenity-800 flex-1">
                  {verse.title}
                </h3>
                {session && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(verse.id)
                    }}
                    className="p-1 hover:bg-serenity-100 rounded"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        verse.is_favorite
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-serenity-400'
                      }`}
                    />
                  </button>
                )}
              </div>
              
              <p className="text-serenity-700 line-clamp-3 mb-4">
                {verse.content}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {verse.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-serenia-100 text-serenia-700 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {verse.tags.length > 3 && (
                  <span className="px-2 py-1 bg-serenity-100 text-serenity-600 rounded-full text-xs">
                    +{verse.tags.length - 3} más
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm text-serenity-500">
                <span className="capitalize">{verse.category}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      copyToClipboard(`${verse.title}: ${verse.content}`)
                    }}
                    className="p-1 hover:bg-serenity-100 rounded"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      shareVerse(verse)
                    }}
                    className="p-1 hover:bg-serenity-100 rounded"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVerses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-serenity-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-serenity-600 mb-2">
              No se encontraron versículos
            </h3>
            <p className="text-serenity-500">
              Intenta ajustar tus filtros de búsqueda
            </p>
          </div>
        )}
      </div>

      {/* Verse Modal */}
      {selectedVerse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-serenity-800">
                  {selectedVerse.title}
                </h2>
                <button
                  onClick={() => setSelectedVerse(null)}
                  className="p-2 hover:bg-serenity-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-lg text-serenity-700 leading-relaxed mb-6">
                {selectedVerse.content}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedVerse.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-serenia-100 text-serenia-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-serenity-200">
                <span className="text-sm text-serenity-500 capitalize">
                  Categoría: {selectedVerse.category}
                </span>
                <div className="flex space-x-3">
                  <button
                    onClick={() => copyToClipboard(`${selectedVerse.title}: ${selectedVerse.content}`)}
                    className="flex items-center px-4 py-2 bg-serenity-100 text-serenity-700 rounded-lg hover:bg-serenity-200 transition-colors"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </button>
                  <button
                    onClick={() => shareVerse(selectedVerse)}
                    className="flex items-center px-4 py-2 bg-serenia-100 text-serenia-700 rounded-lg hover:bg-serenia-200 transition-colors"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartir
                  </button>
                  {session && (
                    <button
                      onClick={() => toggleFavorite(selectedVerse.id)}
                      className="flex items-center px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                    >
                      <Star
                        className={`w-4 h-4 mr-2 ${
                          selectedVerse.is_favorite ? 'fill-current' : ''
                        }`}
                      />
                      {selectedVerse.is_favorite ? 'Quitar favorito' : 'Favorito'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}