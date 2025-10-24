import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AuthProvider } from '@/components/AuthProvider'
import { Navigation } from '@/components/Navigation'

export async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-serenia-50 to-serenity-100">
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
      </div>
    </AuthProvider>
  )
}