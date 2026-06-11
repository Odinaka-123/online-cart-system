'use client'

import { createAuthClient } from 'better-auth/react'

const baseURL =
  typeof window !== 'undefined'
    ? window.location.origin
    : process.env.BETTER_AUTH_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      process.env.VERCEL_URL ||
      process.env.V0_RUNTIME_URL

export const authClient = createAuthClient({
  baseURL,
})

export const { signIn, signUp, signOut, useSession } = authClient
