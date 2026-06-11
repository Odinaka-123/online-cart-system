import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { user, account } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { signToken, cookieName } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const [existing] = await db.select().from(user).where(eq(user.email, email)).limit(1)
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10)
    const id = randomUUID()

    await db.insert(user).values({
      id,
      name,
      email,
      emailVerified: false,
    })

    await db.insert(account).values({
      id: randomUUID(),
      accountId: id,
      providerId: 'email',
      userId: id,
      password: hashed,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const token = await signToken(id)
    const res = NextResponse.json({ success: true })
    res.cookies.set(cookieName(), token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}