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

        try {
          if (mode === 'signup') {
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