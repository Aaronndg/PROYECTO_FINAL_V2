import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const params = await context.params
    const noteId = params.id

    if (!noteId) {
      return NextResponse.json({ error: 'ID de nota requerido' }, { status: 400 })
    }

    // Aquí se implementaría la consulta real a Supabase para obtener comentarios
    // Por ahora retornamos datos mock
    const mockComments = [
      {
        id: 'comment-1',
        note_id: noteId,
        user_id: 'user-x',
        author_name: 'Laura Martín',
        author_avatar: null,
        content: 'Gracias por compartir esto. Me identifico mucho con tu experiencia.',
        created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
      },
      {
        id: 'comment-2',
        note_id: noteId,
        user_id: 'user-y',
        author_name: 'José Herrera',
        author_avatar: null,
        content: 'Qué testimonio tan poderoso. Dios es fiel en todo momento.',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'comment-3',
        note_id: noteId,
        user_id: 'user-z',
        author_name: 'Carmen López',
        author_avatar: null,
        content: 'Oro para que Dios continúe fortaleciendo tu fe. Bendiciones hermana 🙏',
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      }
    ]

    return NextResponse.json({
      comments: mockComments
    })

  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const params = await context.params
    const noteId = params.id

    if (!noteId) {
      return NextResponse.json({ error: 'ID de nota requerido' }, { status: 400 })
    }

    const body = await request.json()
    const { content } = body

    // Validar contenido del comentario
    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: 'El contenido del comentario es requerido' },
        { status: 400 }
      )
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'El comentario no puede exceder 1000 caracteres' },
        { status: 400 }
      )
    }

    // Crear nuevo comentario
    const newComment = {
      id: `comment-${Date.now()}`,
      note_id: noteId,
      user_id: session.user.id,
      author_name: session.user.name || 'Usuario',
      author_avatar: session.user.image || null,
      content: content.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Aquí se implementaría la inserción real en Supabase
    // Por ahora simulamos la creación exitosa

    return NextResponse.json({
      message: 'Comentario creado exitosamente',
      comment: newComment
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}