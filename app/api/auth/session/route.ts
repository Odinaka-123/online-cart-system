import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET() {
  const currentUser = await getSession()
  if (!currentUser) return NextResponse.json(null, { status: 401 })
  return NextResponse.json({ user: currentUser })
}