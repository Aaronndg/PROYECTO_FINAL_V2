import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

// Safe fallback for demo mode
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'demo-service-key'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        mode: { label: 'Mode', type: 'text' }, // 'signin' or 'signup'
        name: { label: 'Name', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email y contraseña son requeridos')
        }

        const { email, password, mode, name } = credentials

        // Usuarios demo predefinidos para la presentación
        const demoUsers = [
          {
            id: 'demo-user-1',
            email: 'maria@demo.com',
            password: 'demo123',
            name: 'María González',
            image: null
          },
          {
            id: 'demo-user-2', 
            email: 'carlos@demo.com',
            password: 'demo123',
            name: 'Carlos Ramírez',
            image: null
          },
          {
            id: 'demo-user-3',
            email: 'ana@demo.com',
            password: 'demo123',
            name: 'Ana Sofía López',
            image: null
          }
        ]

        try {
          // Primero verificar si es un usuario demo
          console.log('Auth: Attempting login with:', { 
            email, 
            mode, 
            hasPassword: !!password,
            environment: process.env.NODE_ENV,
            hasSecret: !!process.env.NEXTAUTH_SECRET 
          })
          const demoUser = demoUsers.find(user => 
            user.email.toLowerCase() === email.toLowerCase()
          )
          console.log('Auth: Found demo user:', !!demoUser)
          
          if (demoUser && password === demoUser.password) {
            console.log('Demo user authentication successful')
            return {
              id: demoUser.id,
              email: demoUser.email,
              name: demoUser.name,
              image: demoUser.image
            }
          }

          // Si no es usuario demo y no hay modo específico, asumir signin
          const actualMode = mode || 'signin'

          if (actualMode === 'signup') {
            // En modo demo, simular creación de usuario exitosa
            if (supabaseUrl === 'https://demo.supabase.co') {
              return {
                id: 'demo-user-' + Date.now(),
                email,
                name: name || '',
                image: null
              }
            }

            // Registrar nuevo usuario
            const hashedPassword = await bcrypt.hash(password, 12)
            
            // Usar un query directo por ahora
            const { data: existingUser } = await supabase
              .from('users')
              .select('id')
              .eq('email', email)
              .single()

            if (existingUser) {
              throw new Error('El usuario ya existe')
            }

            const { data: user, error } = await supabase
              .from('users')
              .insert({
                email,
                name: name || '',
                password_hash: hashedPassword,
                provider: 'credentials'
              })
              .select()
              .single()

            if (error) {
              console.error('Error creating user:', error)
              throw new Error('Error al crear el usuario')
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image
            }
          } else {
            // En modo demo, simular login exitoso
            if (supabaseUrl === 'https://demo.supabase.co') {
              return {
                id: 'demo-user-signin',
                email,
                name: 'Usuario Demo',
                image: null
              }
            }

            // Iniciar sesión
            const { data: user, error } = await supabase
              .from('users')
              .select('*')
              .eq('email', email)
              .eq('provider', 'credentials')
              .single()

            if (error || !user) {
              throw new Error('Credenciales inválidas')
            }

            const isValidPassword = await bcrypt.compare(password, user.password_hash)
            if (!isValidPassword) {
              throw new Error('Credenciales inválidas')
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image
            }
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw error
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          // Crear o actualizar usuario con Google
          const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', user.email!)
            .single()

          if (!existingUser) {
            const { data: newUser } = await supabase
              .from('users')
              .insert({
                email: user.email!,
                name: user.name || '',
                provider: 'google',
                provider_id: user.id,
                image: user.image
              })
              .select()
              .single()

            user.id = newUser.id
          } else {
            user.id = existingUser.id
          }
          
          return true
        } catch (error) {
          console.error('Error with Google sign in:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development'
}