import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const envInfo = {
    NODE_ENV: process.env.NODE_ENV,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    isVercel: !!process.env.VERCEL,
    vercelUrl: process.env.VERCEL_URL,
    timestamp: new Date().toISOString()
  }
  
  console.log('Environment check:', envInfo)
  
  return NextResponse.json({
    message: 'Environment configuration check',
    environment: envInfo,
    status: 'success'
  })
}