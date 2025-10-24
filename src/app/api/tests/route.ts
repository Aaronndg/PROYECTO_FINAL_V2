import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const completed = searchParams.get('completed')

    const supabase = createClient()

    // Obtener tests disponibles con información de completado
    let query = supabase
      .from('psychological_tests')
      .select(`
        *,
        user_test_results(
          id,
          score,
          completed_at
        )
      `)

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (completed === 'true') {
      query = query.not('user_test_results', 'is', null)
    } else if (completed === 'false') {
      query = query.is('user_test_results', null)
    }

    const { data: tests, error } = await query

    if (error) {
      console.error('Error fetching tests:', error)
      return NextResponse.json(
        { error: 'Failed to fetch tests' },
        { status: 500 }
      )
    }

    // Procesar los datos para incluir información de completado
    const processedTests = tests?.map(test => ({
      ...test,
      is_completed: test.user_test_results?.length > 0,
      last_score: test.user_test_results?.[0]?.score || null,
      last_completed: test.user_test_results?.[0]?.completed_at || null,
      user_test_results: undefined // Remover datos internos
    })) || []

    return NextResponse.json({ tests: processedTests })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, category, questions, duration, difficulty, tags } = body

    // Validar datos requeridos
    if (!title || !description || !category || !questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    const { data: test, error } = await supabase
      .from('psychological_tests')
      .insert({
        title,
        description,
        category,
        questions: JSON.stringify(questions),
        duration: duration || 15,
        difficulty: difficulty || 'medium',
        tags: tags || [],
        questions_count: questions.length,
        created_by: session.user.id
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating test:', error)
      return NextResponse.json(
        { error: 'Failed to create test' },
        { status: 500 }
      )
    }

    return NextResponse.json({ test })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}