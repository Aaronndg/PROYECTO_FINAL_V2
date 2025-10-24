import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const search = url.searchParams.get('search')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')

    // Aquí se implementaría la consulta real a Supabase
    // Por ahora retornamos datos mock
    const mockNotes = [
      {
        id: 'note-1',
        user_id: 'user-1',
        author_name: 'María González',
        author_avatar: null,
        title: 'Cómo Dios me ayudó a superar la ansiedad',
        content: 'Quiero compartir mi testimonio sobre cómo la oración y la confianza en Dios me ayudaron a superar un período muy difícil de ansiedad...',
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
      }
      // Más notas...
    ]

    let filteredNotes = mockNotes

    // Aplicar filtros
    if (category && category !== 'all') {
      filteredNotes = filteredNotes.filter(note => note.category === category)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredNotes = filteredNotes.filter(note => 
        note.title.toLowerCase().includes(searchLower) ||
        note.content.toLowerCase().includes(searchLower) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        note.author_name.toLowerCase().includes(searchLower)
      )
    }

    // Paginación
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedNotes = filteredNotes.slice(startIndex, endIndex)

    return NextResponse.json({
      notes: paginatedNotes,
      pagination: {
        page,
        limit,
        total: filteredNotes.length,
        totalPages: Math.ceil(filteredNotes.length / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching community notes:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, category, tags, is_public } = body

    // Validar campos requeridos
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Título, contenido y categoría son requeridos' },
        { status: 400 }
      )
    }

    // Validar longitud del contenido
    if (title.length > 200) {
      return NextResponse.json(
        { error: 'El título no puede exceder 200 caracteres' },
        { status: 400 }
      )
    }

    if (content.length > 5000) {
      return NextResponse.json(
        { error: 'El contenido no puede exceder 5000 caracteres' },
        { status: 400 }
      )
    }

    // Validar categoría
    const validCategories = ['testimony', 'prayer', 'reflection', 'encouragement', 'question']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Categoría inválida' },
        { status: 400 }
      )
    }

    // Crear nueva nota
    const newNote = {
      id: `note-${Date.now()}`,
      user_id: session.user.id,
      author_name: session.user.name || 'Usuario',
      author_avatar: session.user.image || null,
      title: title.trim(),
      content: content.trim(),
      category,
      tags: Array.isArray(tags) ? tags.filter(tag => tag.trim()).map(tag => tag.toLowerCase()) : [],
      is_public: Boolean(is_public),
      is_featured: false,
      likes_count: 0,
      comments_count: 0,
      views_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Aquí se implementaría la inserción real en Supabase
    // Por ahora simulamos la creación exitosa

    return NextResponse.json({
      message: 'Nota creada exitosamente',
      note: newNote
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating community note:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}