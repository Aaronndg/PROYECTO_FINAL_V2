'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Navigation } from '@/components/Navigation'
import {
  Heart,
  Star,
  BookOpen,
  Quote,
  Calendar,
  User,
  Sparkles,
  RefreshCw,
  Filter
} from 'lucide-react'

interface Testimony {
  id: string
  title: string
  content: string
  author_name: string
  category: 'healing' | 'growth' | 'faith' | 'gratitude' | 'transformation'
  bible_verse?: string
  verse_reference?: string
  created_at: string
  is_featured: boolean
  likes_count: number
}

export default function CommunityPage() {
  const { data: session } = useSession()
  const [testimonies, setTestimonies] = useState<Testimony[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { value: 'all', label: 'Todos', icon: BookOpen, color: 'text-serenia-500' },
    { value: 'healing', label: 'Sanidad', icon: Heart, color: 'text-green-500' },
    { value: 'growth', label: 'Crecimiento', icon: Sparkles, color: 'text-blue-500' },
    { value: 'faith', label: 'Fe', icon: Star, color: 'text-yellow-500' },
    { value: 'gratitude', label: 'Gratitud', icon: Heart, color: 'text-pink-500' },
    { value: 'transformation', label: 'Transformación', icon: RefreshCw, color: 'text-purple-500' }
  ]

  // Testimonios inspiradores predefinidos
  const inspirationalTestimonies: Testimony[] = [
    {
      id: '1',
      title: 'Encontré paz en medio de la tormenta',
      content: 'Durante los momentos más difíciles de mi vida, cuando la ansiedad parecía consumirme, encontré refugio en la oración y la palabra de Dios. Cada día que pasaba meditando en Sus promesas, mi corazón encontraba más calma. Ahora puedo decir que la paz que sobrepasa todo entendimiento es real.',
      author_name: 'María G.',
      category: 'healing',
      bible_verse: 'Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.',
      verse_reference: 'Filipenses 4:7',
      created_at: '2024-01-15',
      is_featured: true,
      likes_count: 47
    },
    {
      id: '2',
      title: 'Aprendí a ver las bendiciones en lo pequeño',
      content: 'Solía quejarme constantemente por lo que me faltaba. Pero al comenzar un diario de gratitud, mis ojos se abrieron a las incontables bendiciones que Dios derrama cada día. Desde el café de la mañana hasta el abrazo de mis hijos, todo es un regalo del cielo.',
      author_name: 'Carlos R.',
      category: 'gratitude',
      bible_verse: 'Dad gracias en todo, porque esta es la voluntad de Dios para con vosotros en Cristo Jesús.',
      verse_reference: '1 Tesalonicenses 5:18',
      created_at: '2024-01-10',
      is_featured: false,
      likes_count: 32
    },
    {
      id: '3',
      title: 'Dios me ayudó a perdonar lo imperdonable',
      content: 'Guardé rencor durante años hasta que entendí que el perdón no es para la otra persona, sino para mi propia libertad. Con la ayuda de Dios y mucha oración, pude liberarme de esa carga. Ahora vivo en paz y mi corazón está sano.',
      author_name: 'Ana L.',
      category: 'transformation',
      bible_verse: 'Antes sed benignos unos con otros, misericordiosos, perdonándoos unos a otros, como Dios también os perdonó a vosotros en Cristo.',
      verse_reference: 'Efesios 4:32',
      created_at: '2024-01-08',
      is_featured: true,
      likes_count: 58
    },
    {
      id: '4',
      title: 'Mi fe creció en tiempos de incertidumbre',
      content: 'Cuando perdí mi trabajo y no sabía qué hacer, decidí confiar completamente en Dios. Ese tiempo de espera se convirtió en el tiempo más hermoso de mi relación con Él. Aprendí que Sus tiempos son perfectos y Sus planes mejores que los míos.',
      author_name: 'Roberto M.',
      category: 'faith',
      bible_verse: 'Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.',
      verse_reference: 'Jeremías 29:11',
      created_at: '2024-01-05',
      is_featured: false,
      likes_count: 41
    },
    {
      id: '5',
      title: 'Encontré mi propósito sirviendo a otros',
      content: 'Después de años sintiéndome vacía, descubrí que mi gozo está en servir a otros. Comenzé ayudando en mi iglesia y ahora lidero un ministerio de apoyo emocional. Dios usa nuestras heridas para sanar a otros.',
      author_name: 'Patricia S.',
      category: 'growth',
      bible_verse: 'Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.',
      verse_reference: 'Romanos 8:28',
      created_at: '2024-01-03',
      is_featured: true,
      likes_count: 65
    },
    {
      id: '6',
      title: 'La oración cambió mi matrimonio',
      content: 'Mi esposo y yo estábamos al borde del divorcio. En lugar de seguir peleando, decidimos orar juntos cada noche. Dios restauró nuestro amor y ahora tenemos un matrimonio más fuerte que nunca. La oración es poderosa.',
      author_name: 'Laura y Miguel H.',
      category: 'healing',
      bible_verse: 'Por tanto, lo que Dios juntó, no lo separe el hombre.',
      verse_reference: 'Marcos 10:9',
      created_at: '2024-01-01',
      is_featured: false,
      likes_count: 39
    }
  ]

  useEffect(() => {
    // Simular carga de testimonios
    const loadTestimonies = () => {
      setLoading(true)
      setTimeout(() => {
        setTestimonies(inspirationalTestimonies)
        setLoading(false)
      }, 1000)
    }

    loadTestimonies()
  }, [])

  const filteredTestimonies = selectedCategory === 'all' 
    ? testimonies 
    : testimonies.filter(t => t.category === selectedCategory)

  const featuredTestimonies = testimonies.filter(t => t.is_featured)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Navigation />
        <div className="pt-24 pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-xl p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-serenia-500 rounded-full mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Testimonios de Fe
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Historias reales de transformación, sanidad y crecimiento espiritual que inspiran y fortalecen nuestra fe.
            </p>
          </div>

          {/* Featured Testimonies */}
          {featuredTestimonies.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Star className="w-6 h-6 text-yellow-500 mr-2" />
                Testimonios Destacados
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredTestimonies.slice(0, 2).map((testimony) => (
                  <div key={testimony.id} className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-serenia-500">
                    <div className="flex items-start mb-4">
                      <Quote className="w-8 h-8 text-serenia-400 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {testimony.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <User className="w-4 h-4 mr-1" />
                          {testimony.author_name}
                          <Calendar className="w-4 h-4 ml-4 mr-1" />
                          {new Date(testimony.created_at).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {testimony.content}
                    </p>
                    
                    {testimony.bible_verse && (
                      <div className="bg-blue-50 rounded-lg p-4 mb-4">
                        <p className="text-blue-800 italic mb-2">
                          "{testimony.bible_verse}"
                        </p>
                        <p className="text-blue-600 text-sm font-medium">
                          {testimony.verse_reference}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        testimony.category === 'healing' ? 'bg-green-100 text-green-800' :
                        testimony.category === 'growth' ? 'bg-blue-100 text-blue-800' :
                        testimony.category === 'faith' ? 'bg-yellow-100 text-yellow-800' :
                        testimony.category === 'gratitude' ? 'bg-pink-100 text-pink-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {categories.find(c => c.value === testimony.category)?.label}
                      </span>
                      <div className="flex items-center text-gray-500">
                        <Heart className="w-4 h-4 mr-1" />
                        <span className="text-sm">{testimony.likes_count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Filter className="w-5 h-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Filtrar por categoría</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category.value
                        ? 'bg-serenia-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-2 ${selectedCategory === category.value ? 'text-white' : category.color}`} />
                    {category.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* All Testimonies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonies.map((testimony) => (
              <div key={testimony.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                <div className="flex items-start mb-4">
                  <Quote className="w-6 h-6 text-serenia-400 mr-2 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {testimony.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <User className="w-3 h-3 mr-1" />
                      {testimony.author_name}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {testimony.content}
                </p>
                
                {testimony.bible_verse && (
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <p className="text-blue-800 text-xs italic line-clamp-2">
                      "{testimony.bible_verse}"
                    </p>
                    <p className="text-blue-600 text-xs font-medium mt-1">
                      {testimony.verse_reference}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    testimony.category === 'healing' ? 'bg-green-100 text-green-800' :
                    testimony.category === 'growth' ? 'bg-blue-100 text-blue-800' :
                    testimony.category === 'faith' ? 'bg-yellow-100 text-yellow-800' :
                    testimony.category === 'gratitude' ? 'bg-pink-100 text-pink-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {categories.find(c => c.value === testimony.category)?.label}
                  </span>
                  <div className="flex items-center text-gray-400">
                    <Heart className="w-4 h-4 mr-1" />
                    <span className="text-xs">{testimony.likes_count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
              <Sparkles className="w-12 h-12 text-serenia-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Tu historia también puede inspirar
              </h3>
              <p className="text-gray-600 mb-6">
                Si Dios ha obrado en tu vida, tu testimonio puede ser una luz para otros que están pasando por situaciones similares.
              </p>
              <p className="text-sm text-gray-500 italic">
                "Y ellos le han vencido por medio de la sangre del Cordero y de la palabra del testimonio de ellos"
                <br />
                <span className="font-medium">Apocalipsis 12:11</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
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
  const [demoMode, setDemoMode] = useState(false)

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
      // Demo mode - load sample data
      setDemoMode(true)
      loadDemoNotes()
      return
    }

    if (session?.user) {
      setDemoMode(false)
      loadCommunityNotes()
    }
  }, [session, status])

  useEffect(() => {
    filterNotes()
  }, [notes, selectedCategory, searchQuery])

  const loadDemoNotes = () => {
    const demoNotes: CommunityNote[] = [
      {
        id: 'demo-1',
        user_id: 'demo-user-1',
        author_name: 'María González',
        title: 'Cómo Dios me ayudó a superar la ansiedad',
        content: 'Quiero compartir mi testimonio sobre cómo la oración y la confianza en Dios me ayudaron a superar un período muy difícil de ansiedad. Durante meses, me sentía abrumada por las preocupaciones del trabajo y la familia...\n\nPero cuando comencé a dedicar tiempo cada mañana para orar y meditar en Filipenses 4:6-7, todo cambió. Aprendí a entregar mis cargas a Dios y experimenté Su paz que sobrepasa todo entendimiento.',
        category: 'testimony',
        tags: ['ansiedad', 'oración', 'testimonio', 'paz'],
        is_public: true,
        is_featured: true,
        likes_count: 23,
        comments_count: 8,
        views_count: 156,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'demo-2',
        user_id: 'demo-user-2',
        author_name: 'Carlos Ramírez',
        title: 'Reflexión sobre el perdón',
        content: 'El perdón es uno de los temas más difíciles pero más hermosos del cristianismo. He estado reflexionando sobre Mateo 6:14-15 y cómo Jesús nos enseña que debemos perdonar como hemos sido perdonados...\n\nEs un proceso, no un evento. Cada día debo elegir perdonar, incluso cuando no siento ganas de hacerlo.',
        category: 'reflection',
        tags: ['perdón', 'reflexión', 'Jesús', 'proceso'],
        is_public: true,
        is_featured: false,
        likes_count: 17,
        comments_count: 5,
        views_count: 89,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'demo-3',
        user_id: 'demo-user-3',
        author_name: 'Ana Sofía',
        title: 'Petición de oración por mi familia',
        content: 'Hermanos, les pido que oren por mi familia. Mi esposo ha perdido su trabajo y estamos pasando por un momento muy difícil económicamente. Sé que Dios tiene el control, pero a veces la fe se tambalea...\n\nAgradezco sus oraciones y cualquier palabra de ánimo.',
        category: 'prayer',
        tags: ['oración', 'familia', 'trabajo', 'dificultades'],
        is_public: true,
        is_featured: false,
        likes_count: 31,
        comments_count: 12,
        views_count: 234,
        created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      }
    ]
    
    setNotes(demoNotes)
    setLoading(false)
  }

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

        {/* Demo Mode Alert */}
        {demoMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-600 mr-2" />
              <p className="text-yellow-800">
                <strong>Modo Demo:</strong> Explorando contenido de muestra de la comunidad. Para participar y compartir,{' '}
                <a href="/auth/signin" className="text-yellow-900 underline">
                  crea una cuenta gratuita
                </a>.
              </p>
            </div>
          </div>
        )}

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
            {demoMode ? (
              <a
                href="/auth/signin"
                className="bg-serenia-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-serenia-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Unirse para Participar
              </a>
            ) : (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-serenia-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-serenia-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Nota
              </button>
            )}
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