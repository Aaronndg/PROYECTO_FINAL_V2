import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@/lib/supabase'

// Base de datos de versículos demo con múltiples versiones
const demoVerses = [
  {
    id: '1',
    reference: 'Filipenses 4:6-7',
    text_rv60: 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.',
    text_ntv: 'No se preocupen por nada; en cambio, oren por todo. Díganle a Dios lo que necesitan y denle gracias por todo lo que él ha hecho. Así experimentarán la paz de Dios, que supera todo lo que podemos entender. La paz de Dios cuidará su corazón y su mente mientras vivan en Cristo Jesús.',
    mood_tags: ['ansiedad', 'paz', 'oración']
  },
  {
    id: '2',
    reference: 'Salmos 34:18',
    text_rv60: 'Cercano está Jehová a los quebrantados de corazón; Y salva a los contritos de espíritu.',
    text_ntv: 'El Señor está cerca de los que tienen quebrantado el corazón; él rescata a los de espíritu destrozado.',
    mood_tags: ['tristeza', 'consuelo', 'esperanza']
  },
  {
    id: '3',
    reference: '1 Juan 4:19',
    text_rv60: 'Nosotros le amamos a él, porque él nos amó primero.',
    text_ntv: 'Nosotros amamos porque él nos amó primero.',
    mood_tags: ['amor', 'relación con Dios']
  },
  {
    id: '4',
    reference: 'Isaías 41:10',
    text_rv60: 'No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.',
    text_ntv: 'No tengas miedo, porque yo estoy contigo; no te desalientes, porque yo soy tu Dios. Te daré fuerzas y te ayudaré; te sostendré con mi mano derecha victoriosa.',
    mood_tags: ['miedo', 'fortaleza', 'protección']
  },
  {
    id: '5',
    reference: 'Romanos 8:28',
    text_rv60: 'Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.',
    text_ntv: 'Y sabemos que Dios hace que todas las cosas cooperen para el bien de quienes lo aman y son llamados según el propósito que él tiene para ellos.',
    mood_tags: ['esperanza', 'propósito', 'confianza']
  },
  {
    id: '6',
    reference: 'Salmos 23:4',
    text_rv60: 'Aunque ande en valle de sombra de muerte, no temeré mal alguno, porque tú estarás conmigo; tu vara y tu cayado me infundirán aliento.',
    text_ntv: 'Aun cuando yo pase por el valle más oscuro, no temeré, porque tú estás a mi lado. Tu vara y tu cayado me protegen y me consuelan.',
    mood_tags: ['miedo', 'protección', 'consuelo']
  },
  {
    id: '7',
    reference: 'Jeremías 29:11',
    text_rv60: 'Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.',
    text_ntv: 'Pues yo sé los planes que tengo para ustedes —dice el Señor—. Son planes para lo bueno y no para lo malo, para darles un futuro y una esperanza.',
    mood_tags: ['esperanza', 'futuro', 'planes de Dios']
  },
  {
    id: '8',
    reference: 'Mateo 11:28',
    text_rv60: 'Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.',
    text_ntv: 'Luego dijo Jesús: "Vengan a mí todos los que están cansados y llevan cargas pesadas, y yo les daré descanso."',
    mood_tags: ['cansancio', 'descanso', 'invitación']
  },
  {
    id: '9',
    reference: 'Salmos 46:1',
    text_rv60: 'Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.',
    text_ntv: 'Dios es nuestro refugio y nuestra fuerza; siempre está dispuesto a ayudar en tiempos de dificultad.',
    mood_tags: ['fortaleza', 'refugio', 'ayuda']
  },
  {
    id: '10',
    reference: '1 Pedro 5:7',
    text_rv60: 'Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.',
    text_ntv: 'Pongan todas sus preocupaciones y ansiedades en las manos de Dios, porque él cuida de ustedes.',
    mood_tags: ['ansiedad', 'cuidado de Dios', 'entrega']
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mood = searchParams.get('mood') || 'todas'
    const search = searchParams.get('search') || ''
    const limit = parseInt(searchParams.get('limit') || '20')
    
    // Obtener sesión para verificar favoritos del usuario
    const session = await getServerSession(authOptions)
    
    let filteredVerses = [...demoVerses]

    // Filtrar por estado de ánimo
    if (mood !== 'todas') {
      filteredVerses = filteredVerses.filter(verse => 
        verse.mood_tags.some(tag => tag.includes(mood))
      )
    }

    // Filtrar por búsqueda
    if (search) {
      const searchLower = search.toLowerCase()
      filteredVerses = filteredVerses.filter(verse => 
        verse.reference.toLowerCase().includes(searchLower) ||
        verse.text_rv60.toLowerCase().includes(searchLower) ||
        verse.text_ntv.toLowerCase().includes(searchLower) ||
        verse.mood_tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // Limitar resultados
    filteredVerses = filteredVerses.slice(0, limit)

    // Si hay usuario autenticado, intentar obtener favoritos de la base de datos
    let versesWithFavorites = filteredVerses
    if (session?.user?.id) {
      try {
        const supabase = createClient()
        const { data: favorites } = await supabase
          .from('user_favorites')
          .select('content_id')
          .eq('user_id', session.user.id)

        const favoriteIds = new Set(favorites?.map(f => f.content_id) || [])
        
        versesWithFavorites = filteredVerses.map(verse => ({
          ...verse,
          is_favorite: favoriteIds.has(verse.id)
        }))
      } catch (error) {
        console.log('Error obteniendo favoritos, usando datos demo:', error)
        // Si falla la conexión a la BD, usar datos demo sin favoritos
        versesWithFavorites = filteredVerses
      }
    }

    return NextResponse.json({
      verses: versesWithFavorites,
      total: versesWithFavorites.length,
      filters: {
        mood,
        search
      }
    })

  } catch (error) {
    console.error('Error in verses API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}