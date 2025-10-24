import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PUT(
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
    const { title, content, category, tags, is_public } = body

    // Validar campos requeridos
    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Título, contenido y categoría son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el usuario sea el autor de la nota
    // Aquí se implementaría la consulta real a Supabase
    const isAuthor = true // Simular verificación

    if (!isAuthor) {
      return NextResponse.json(
        { error: 'No tienes permisos para editar esta nota' },
        { status: 403 }
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

    // Actualizar nota
    const updatedNote = {
      id: noteId,
      title: title.trim(),
      content: content.trim(),
      category,
      tags: Array.isArray(tags) ? tags.filter(tag => tag.trim()).map(tag => tag.toLowerCase()) : [],
      is_public: Boolean(is_public),
      updated_at: new Date().toISOString()
    }

    // Aquí se implementaría la actualización real en Supabase

    return NextResponse.json({
      message: 'Nota actualizada exitosamente',
      note: updatedNote
    })

  } catch (error) {
    console.error('Error updating note:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    // Verificar que el usuario sea el autor de la nota o tenga permisos de moderador
    // Aquí se implementaría la consulta real a Supabase
    const isAuthorOrModerator = true // Simular verificación

    if (!isAuthorOrModerator) {
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar esta nota' },
        { status: 403 }
      )
    }

    // Eliminar nota y todos sus comentarios
    // Aquí se implementaría la eliminación real en Supabase

    return NextResponse.json({
      message: 'Nota eliminada exitosamente'
    })

  } catch (error) {
    console.error('Error deleting note:', error)
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
    const { action, reason } = body

    // Validar acción
    if (!action || !['report', 'moderate'].includes(action)) {
      return NextResponse.json(
        { error: 'Acción inválida' },
        { status: 400 }
      )
    }

    if (action === 'report') {
      // Reportar nota
      if (!reason || !reason.trim()) {
        return NextResponse.json(
          { error: 'La razón del reporte es requerida' },
          { status: 400 }
        )
      }

      // Crear reporte
      const report = {
        id: `report-${Date.now()}`,
        note_id: noteId,
        reporter_id: session.user.id,
        reason: reason.trim(),
        status: 'pending',
        created_at: new Date().toISOString()
      }

      // Aquí se implementaría la inserción del reporte en Supabase

      return NextResponse.json({
        message: 'Reporte enviado exitosamente',
        report
      })
    }

    if (action === 'moderate') {
      // Solo moderadores pueden usar esta acción
      const isModerator = false // Verificar rol de moderador

      if (!isModerator) {
        return NextResponse.json(
          { error: 'No tienes permisos de moderador' },
          { status: 403 }
        )
      }

      // Aplicar moderación (ocultar nota, marcar como inapropiada, etc.)
      // Aquí se implementaría la lógica de moderación

      return NextResponse.json({
        message: 'Moderación aplicada exitosamente'
      })
    }

  } catch (error) {
    console.error('Error processing note action:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}