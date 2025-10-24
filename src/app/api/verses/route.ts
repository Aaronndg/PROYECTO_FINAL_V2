import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const emotion = searchParams.get('emotion')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    // Obtener sesión para verificar favoritos del usuario
    const session = await getServerSession(authOptions)
    
    const supabase = createClient()
    
    let query = supabase
      .from('wellness_content')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    // Aplicar filtros
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (emotion && emotion !== 'all') {
      query = query.contains('tags', [emotion])
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    }

    const { data: verses, error } = await query

    if (error) {
      console.error('Error fetching verses:', error)
      return NextResponse.json(
        { error: 'Error al obtener versículos' },
        { status: 500 }
      )
    }

    // Si hay usuario autenticado, obtener sus favoritos
    let versesWithFavorites = verses || []
    if (session?.user?.id) {
      const { data: favorites } = await supabase
        .from('user_favorites')
        .select('content_id')
        .eq('user_id', session.user.id)

      const favoriteIds = new Set(favorites?.map(f => f.content_id) || [])
      
      versesWithFavorites = verses?.map(verse => ({
        ...verse,
        is_favorite: favoriteIds.has(verse.id)
      })) || []
    }

    return NextResponse.json({
      verses: versesWithFavorites,
      total: verses?.length || 0
    })

  } catch (error) {
    console.error('Error in verses API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}