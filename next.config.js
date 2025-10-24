/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@supabase/ssr'],
  // Configuración para deployment en Vercel
  generateEtags: false,
  poweredByHeader: false,
  images: {
    domains: ['lh3.googleusercontent.com']
  }
}

module.exports = nextConfig