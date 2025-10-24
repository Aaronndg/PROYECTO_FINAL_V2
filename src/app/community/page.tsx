'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Navigation } from '@/components/Navigation'
import {
  Users,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
  Search,
  Filter,
  Star,
  Eye,
  Calendar,
  Tag,
  MoreVertical,
  Edit3,
  Trash2,
  Flag,
  Clock,
  ThumbsUp,
  Send,
  X,
  Check
} from 'lucide-react'

interface CommunityNote {
  id: string
  user_id: string
  author_name: string
  author_avatar?: string
  title: string
  content: string
  category: string
  tags: string[]
  is_public: boolean
  is_featured: boolean
  likes_count: number
  comments_count: number
  views_count: number
  created_at: string
  updated_at: string
  is_liked?: boolean
  is_author?: boolean
}

interface Comment {
  id: string
  note_id: string
  user_id: string
  author_name: string
  content: string
  created_at: string
}

export default function CommunityPage() {
  const { data: session, status } = useSession()
  const [notes, setNotes] = useState<CommunityNote[]>([])
  const [filteredNotes, setFilteredNotes] = useState<CommunityNote[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedNote, setSelectedNote] = useState<CommunityNote | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')

  const categories = [
    { value: 'all', label: 'Todas', icon: Users, color: 'text-gray-500' },
    { value: 'testimony', label: 'Testimonios', icon: Heart, color: 'text-red-500' },
    { value: 'prayer', label: 'Oración', icon: Star, color: 'text-yellow-500' },
    { value: 'reflection', label: 'Reflexiones', icon: BookOpen, color: 'text-blue-500' },
    { value: 'encouragement', label: 'Ánimo', icon: ThumbsUp, color: 'text-green-500' },
    { value: 'question', label: 'Preguntas', icon: MessageCircle, color: 'text-purple-500' }
  ]

  useEffect(() => {
    if (status === 'loading') return
    
    if (status === 'unauthenticated') {
      window.location.href = '/auth/signin'
      return
    }

    if (session?.user) {
      loadCommunityNotes()
    }
  }, [session, status])

  useEffect(() => {
    filterNotes()
  }, [notes, selectedCategory, searchQuery])

  const loadCommunityNotes = async () => {
    try {
      // Simular datos de notas comunitarias
      const mockNotes: CommunityNote[] = [
        {
          id: 'note-1',
          user_id: 'user-1',
          author_name: 'María González',
          title: 'Cómo Dios me ayudó a superar la ansiedad',
          content: 'Quiero compartir mi testimonio sobre cómo la oración y la confianza en Dios me ayudaron a superar un período muy difícil de ansiedad. Durante meses, me sentía abrumada por las preocupaciones del trabajo y la familia...\n\nPero cuando comencé a dedicar tiempo cada mañana para orar y meditar en Filipenses 4:6-7, todo cambió. Aprendí a entregar mis cargas a Dios y experimenté Su paz que sobrepasa todo entendimiento.',
          category: 'testimony',
          tags: ['ansiedad', 'oración', 'testimonio', 'paz'],
          is_public: true,
          is_featured: true,
          likes_count: 24,
          comments_count: 8,
          views_count: 156,
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          is_liked: false,
          is_author: false
        },
        {
          id: 'note-2',
          user_id: 'user-2',
          author_name: 'Carlos Mendoza',
          title: 'Reflexión sobre el perdón',
          content: 'He estado reflexionando mucho sobre el perdón últimamente. Es increíble cómo Jesús nos enseña a perdonar "setenta veces siete". No es fácil, especialmente cuando las heridas son profundas, pero he descubierto que el perdón es más para nosotros que para la otra persona.',
          category: 'reflection',
          tags: ['perdón', 'sanidad', 'reflexión'],
          is_public: true,
          is_featured: false,
          likes_count: 18,
          comments_count: 12,
          views_count: 203,
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          is_liked: true,
          is_author: false
        },
        {
          id: 'note-3',
          user_id: session?.user?.id || 'current-user',
          author_name: session?.user?.name || 'Tú',
          title: 'Petición de oración por mi familia',
          content: 'Hermanos, les pido que oren por mi familia. Estamos pasando por un momento difícil y necesitamos la sabiduría y dirección de Dios. Creo firmemente en el poder de la oración comunitaria.',
          category: 'prayer',
          tags: ['familia', 'oración', 'petición'],
          is_public: true,
          is_featured: false,
          likes_count: 31,
          comments_count: 15,
          views_count: 89,
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          is_liked: false,
          is_author: true
        },
        {
          id: 'note-4',
          user_id: 'user-4',
          author_name: 'Ana Rodríguez',
          title: '¿Cómo mantener la fe en tiempos difíciles?',
          content: 'Últimamente he estado luchando para mantener mi fe fuerte. Los problemas económicos y de salud en mi familia me tienen preocupada. ¿Alguien tiene consejos o versículos que les hayan ayudado en situaciones similares?',
          category: 'question',
          tags: ['fe', 'dificultades', 'consejo'],
          is_public: true,
          is_featured: false,
          likes_count: 12,
          comments_count: 22,
          views_count: 167,
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          is_liked: false,
          is_author: false
        },
        {
          id: 'note-5',
          user_id: 'user-5',
          author_name: 'Pedro Silva',
          title: 'Palabras de ánimo para quien las necesite',
          content: 'Si estás leyendo esto y te sientes desanimado, quiero que sepas que Dios tiene planes de bien para tu vida. "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis" (Jeremías 29:11). ¡No te rindas!',
          category: 'encouragement',
          tags: ['ánimo', 'esperanza', 'versículo'],
          is_public: true,
          is_featured: true,
          likes_count: 45,
          comments_count: 6,
          views_count: 234,
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          is_liked: true,
          is_author: false
        }
      ]

      setNotes(mockNotes)
    } catch (error) {
      console.error('Error loading community notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterNotes = () => {
    let filtered = notes

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(note => note.category === selectedCategory)
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query)) ||
        note.author_name.toLowerCase().includes(query)
      )
    }

    // Ordenar por destacadas primero, luego por fecha
    filtered.sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1
      if (!a.is_featured && b.is_featured) return 1
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    setFilteredNotes(filtered)
  }

  const toggleLike = async (noteId: string) => {
    setNotes(prev => prev.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          is_liked: !note.is_liked,
          likes_count: note.is_liked ? note.likes_count - 1 : note.likes_count + 1
        }
      }
      return note
    }))
  }

  const openNoteDetail = (note: CommunityNote) => {
    setSelectedNote(note)
    loadComments(note.id)
  }

  const loadComments = async (noteId: string) => {
    // Simular carga de comentarios
    const mockComments: Comment[] = [
      {
        id: 'comment-1',
        note_id: noteId,
        user_id: 'user-x',
        author_name: 'Laura Martín',
        content: 'Gracias por compartir esto. Me identifigo mucho con tu experiencia.',
        created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
      },
      {
        id: 'comment-2',
        note_id: noteId,
        user_id: 'user-y',
        author_name: 'José Herrera',
        content: 'Qué testimonio tan poderoso. Dios es fiel en todo momento.',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ]
    setComments(mockComments)
  }

  const addComment = async () => {
    if (!newComment.trim() || !selectedNote) return

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      note_id: selectedNote.id,
      user_id: session?.user?.id || '',
      author_name: session?.user?.name || 'Usuario',
      content: newComment,
      created_at: new Date().toISOString()
    }

    setComments(prev => [...prev, comment])
    setNewComment('')

    // Actualizar contador de comentarios
    setNotes(prev => prev.map(note => 
      note.id === selectedNote.id 
        ? { ...note, comments_count: note.comments_count + 1 }
        : note
    ))
  }

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Hace unos minutos'
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`
    
    return time.toLocaleDateString('es-ES', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getCategoryInfo = (category: string) => {
    return categories.find(cat => cat.value === category) || categories[0]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-serenia-600 mx-auto mb-4"></div>
              <p className="text-serenity-600">Cargando comunidad...</p>
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
            <Users className="w-12 h-12 text-serenia-500 mr-3" />
            <h1 className="text-4xl font-bold text-serenia-800">Comunidad SerenIA</h1>
          </div>
          <p className="text-xl text-serenity-600 max-w-3xl mx-auto">
            Comparte tu fe, encuentra apoyo y crece junto a una comunidad de hermanos en Cristo
          </p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-1 items-center space-x-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-serenity-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar notas, autores, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-serenity-300 rounded-lg focus:ring-2 focus:ring-serenia-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-2 overflow-x-auto">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.value}
                      onClick={() => setSelectedCategory(category.value)}
                      className={`flex items-center px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                        selectedCategory === category.value
                          ? 'bg-serenia-500 text-white'
                          : 'bg-serenity-100 text-serenity-700 hover:bg-serenity-200'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-1" />
                      {category.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Create Note Button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-serenia-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-serenia-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Nota
            </button>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => {
            const categoryInfo = getCategoryInfo(note.category)
            const CategoryIcon = categoryInfo.icon

            return (
              <div key={note.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Note Header */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-serenia-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-serenia-600 font-semibold text-sm">
                          {note.author_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-serenity-800">{note.author_name}</p>
                        <p className="text-xs text-serenity-500">{formatTimeAgo(note.created_at)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {note.is_featured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                      <CategoryIcon className={`w-4 h-4 ${categoryInfo.color}`} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-serenity-800 mb-3 line-clamp-2">
                    {note.title}
                  </h3>

                  {/* Content Preview */}
                  <p className="text-serenity-600 text-sm leading-relaxed mb-4 line-clamp-4">
                    {note.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {note.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-serenia-100 text-serenia-700 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="px-2 py-1 bg-serenity-100 text-serenity-600 rounded-full text-xs">
                        +{note.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Interaction Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-serenity-500">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {note.views_count}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {note.comments_count}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleLike(note.id)}
                        className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors ${
                          note.is_liked
                            ? 'text-red-500 bg-red-50'
                            : 'text-serenity-500 hover:text-red-500 hover:bg-red-50'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${note.is_liked ? 'fill-current' : ''}`} />
                        <span className="text-sm">{note.likes_count}</span>
                      </button>

                      <button
                        onClick={() => openNoteDetail(note)}
                        className="text-serenia-600 hover:text-serenia-700 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-serenity-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-serenity-600 mb-2">
              No se encontraron notas
            </h3>
            <p className="text-serenity-500 mb-6">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Intenta ajustar tus filtros de búsqueda'
                : 'Sé el primero en compartir una reflexión con la comunidad'}
            </p>
            {!searchQuery && selectedCategory === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-serenia-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-serenia-700 transition-colors"
              >
                Crear Primera Nota
              </button>
            )}
          </div>
        )}
      </div>

      {/* Note Detail Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-serenity-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-serenia-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-serenia-600 font-semibold">
                      {selectedNote.author_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-serenity-800">{selectedNote.title}</h2>
                    <p className="text-sm text-serenity-600">
                      Por {selectedNote.author_name} • {formatTimeAgo(selectedNote.created_at)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="text-serenity-400 hover:text-serenity-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="prose max-w-none">
                <p className="text-serenity-700 leading-relaxed whitespace-pre-line">
                  {selectedNote.content}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 my-6">
                {selectedNote.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-serenia-100 text-serenia-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Comments Section */}
              <div className="border-t border-serenity-200 pt-6">
                <h3 className="text-lg font-semibold text-serenity-800 mb-4">
                  Comentarios ({comments.length})
                </h3>

                {/* Add Comment */}
                <div className="mb-6">
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-serenia-100 rounded-full flex items-center justify-center">
                      <span className="text-serenia-600 font-semibold text-xs">
                        {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribe un comentario alentador..."
                        className="w-full p-3 border border-serenity-300 rounded-lg resize-none focus:ring-2 focus:ring-serenia-500 focus:border-transparent"
                        rows={3}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={addComment}
                          disabled={!newComment.trim()}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            newComment.trim()
                              ? 'bg-serenia-600 text-white hover:bg-serenia-700'
                              : 'bg-serenity-200 text-serenity-400 cursor-not-allowed'
                          }`}
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="w-8 h-8 bg-serenity-100 rounded-full flex items-center justify-center">
                        <span className="text-serenity-600 font-semibold text-xs">
                          {comment.author_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-serenity-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-serenity-800 text-sm">
                              {comment.author_name}
                            </span>
                            <span className="text-xs text-serenity-500">
                              {formatTimeAgo(comment.created_at)}
                            </span>
                          </div>
                          <p className="text-serenity-700 text-sm">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}