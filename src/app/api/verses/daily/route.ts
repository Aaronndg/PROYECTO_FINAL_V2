import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase'

export async function GET() {
  try {
    // Obtener sesión para personalización
    const session = await getServerSession(authOptions)
    
    const supabase = createAdminClient()
    
    // Usar la fecha actual como semilla para selección determinística
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const seed = today.split('-').reduce((acc, part) => acc + parseInt(part), 0)
    
    let dailyVerse = null

    if (session?.user?.id) {
      // Si hay usuario, intentar personalizar basado en su historial emocional reciente
      const { data: recentMoods } = await supabase
        .from('mood_entries')
        .select('mood_score, tags')
        .eq('user_id', session.user.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Últimos 7 días
        .order('created_at', { ascending: false })
        .limit(10)

      if (recentMoods && recentMoods.length > 0) {
        // Calcular promedio de humor y tags más frecuentes
        const avgMood = recentMoods.reduce((sum, entry) => sum + entry.mood_score, 0) / recentMoods.length
        const allTags = recentMoods.flatMap(entry => entry.tags || [])
        const tagCounts = allTags.reduce((acc, tag) => {
          acc[tag] = (acc[tag] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        
        const topTags = Object.entries(tagCounts)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 3)
          .map(([tag]) => tag)

        // Seleccionar versículo basado en el estado emocional
        let targetTags = []
        if (avgMood < 5) {
          // Humor bajo - ofrecer esperanza y consuelo
          targetTags = ['esperanza', 'consuelo', 'fortaleza', 'paz']
        } else if (avgMood > 7) {
          // Humor alto - ofrecer gratitud y celebración
          targetTags = ['gratitud', 'alegría', 'bendición', 'celebración']
        } else {
          // Humor neutral - usar tags del usuario o generales
          targetTags = topTags.length > 0 ? topTags : ['paz', 'esperanza', 'fortaleza']
        }

        // Buscar versículo que coincida con las necesidades emocionales
        const { data: personalizedVerses } = await supabase
          .from('wellness_content')
          .select('*')
          .overlaps('tags', targetTags)
          .limit(10)

        if (personalizedVerses && personalizedVerses.length > 0) {
          const index = seed % personalizedVerses.length
          dailyVerse = personalizedVerses[index]
        }
      }
    }

    // Si no hay versículo personalizado, seleccionar uno general
    if (!dailyVerse) {
      const { data: allVerses } = await supabase
        .from('wellness_content')
        .select('*')
        .limit(100) // Limitar para mejor performance

      if (allVerses && allVerses.length > 0) {
        const index = seed % allVerses.length
        dailyVerse = allVerses[index]
      }
    }

    // Verificar si es favorito del usuario
    if (dailyVerse && session?.user?.id) {
      const { data: favorite } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('content_id', dailyVerse.id)
        .single()

      dailyVerse.is_favorite = !!favorite
    }

    return NextResponse.json({
      verse: dailyVerse,
      personalized: !!session?.user?.id,
      date: today
    })

  } catch (error) {
    console.error('Error fetching daily verse:', error)
    
    // Fallback: devolver un versículo por defecto
    const fallbackVerse = {
      id: 'fallback',
      title: 'Filipenses 4:6-7',
      content: 'Por nada estén afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.',
      category: 'prayer',
      tags: ['paz', 'oración', 'ansiedad', 'tranquilidad'],
      created_at: new Date().toISOString(),
      is_favorite: false
    }

    return NextResponse.json({
      verse: fallbackVerse,
      personalized: false,
      date: new Date().toISOString().split('T')[0],
      fallback: true
    })
  }
}