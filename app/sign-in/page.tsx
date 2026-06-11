import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'

export default async function SignInPage() {
  const user = await getSession()
  if (user) redirect('/')
  return <AuthForm mode="sign-in" />
}