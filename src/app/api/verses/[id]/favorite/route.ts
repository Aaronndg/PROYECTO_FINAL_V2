import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Obtener parámetros de manera asíncrona
    const { id } = await params
    
    // Verificar autenticación
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const supabase = createClient()

    const verseId = id
    const userId = session.user.id

    // Verificar si el versículo existe
    const { data: verse, error: verseError } = await supabase
      .from('wellness_content')
      .select('id')
      .eq('id', verseId)
      .single()

    if (verseError || !verse) {
      return NextResponse.json(
        { error: 'Versículo no encontrado' },
        { status: 404 }
      )
    }

    // Verificar si ya es favorito
    const { data: existingFavorite, error: checkError } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('content_id', verseId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 es "no rows returned", otros errores son problemas reales
      console.error('Error checking favorite:', checkError)
      return NextResponse.json(
        { error: 'Error al verificar favorito' },
        { status: 500 }
      )
    }

    let isFavorite = false

    if (existingFavorite) {
      // Si ya es favorito, removerlo
      const { error: deleteError } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', existingFavorite.id)

      if (deleteError) {
        console.error('Error removing favorite:', deleteError)
        return NextResponse.json(
          { error: 'Error al remover favorito' },
          { status: 500 }
        )
      }
      
      isFavorite = false
    } else {
      // Si no es favorito, agregarlo
      const { error: insertError } = await supabase
        .from('user_favorites')
        .insert({
          user_id: userId,
          content_id: verseId,
          favorite_type: 'verse'
        })

      if (insertError) {
        console.error('Error adding favorite:', insertError)
        return NextResponse.json(
          { error: 'Error al agregar favorito' },
          { status: 500 }
        )
      }
      
      isFavorite = true
    }

    return NextResponse.json({
      success: true,
      is_favorite: isFavorite,
      message: isFavorite ? 'Agregado a favoritos' : 'Removido de favoritos'
    })

  } catch (error) {
    console.error('Error in favorite API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}