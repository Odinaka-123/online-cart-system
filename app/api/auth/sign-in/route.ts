import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { user, account } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { signToken, cookieName } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const [currentUser] = await db.select().from(user).where(eq(user.email, email)).limit(1)
  if (!currentUser) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const [acc] = await db.select().from(account).where(eq(account.userId, currentUser.id)).limit(1)
  if (!acc?.password) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, acc.password)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const token = await signToken(currentUser.id)
  const res = NextResponse.json({ success: true })
  res.cookies.set(cookieName(), token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
