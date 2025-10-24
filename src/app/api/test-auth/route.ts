import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    
    // Usuarios demo (mismo array que en auth.ts)
    const demoUsers = [
      {
        id: 'demo-user-1',
        email: 'maria@demo.com',
        password: 'demo123',
        name: 'María González'
      },
      {
        id: 'demo-user-2', 
        email: 'carlos@demo.com',
        password: 'demo123',
        name: 'Carlos Ramírez'
      },
      {
        id: 'demo-user-3',
        email: 'ana@demo.com',
        password: 'demo123',
        name: 'Ana Sofía López'
      }
    ]
    
    console.log('Test API: Received credentials:', { email, password })
    
    const demoUser = demoUsers.find(user => user.email === email)
    console.log('Test API: Found demo user:', demoUser)
    
    if (demoUser && password === demoUser.password) {
      console.log('Test API: Authentication successful')
      return NextResponse.json({ 
        success: true, 
        user: {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name
        }
      })
    } else {
      console.log('Test API: Authentication failed')
      return NextResponse.json({ 
        success: false, 
        message: 'Credenciales inválidas' 
      }, { status: 401 })
    }
    
  } catch (error) {
    console.error('Test API: Error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Error interno del servidor' 
    }, { status: 500 })
  }
}