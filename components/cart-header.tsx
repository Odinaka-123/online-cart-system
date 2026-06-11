'use client'

import Link from 'next/link'
import { ShoppingCart, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface CartHeaderProps {
  cartCount?: number
  session?: any
}

export function CartHeader({ cartCount = 0, session }: CartHeaderProps) {
  const router = useRouter()
  const [isSigning, setIsSigning] = useState(false)

  const handleSignOut = async () => {
    setIsSigning(true)
    try {
      await authClient.signOut()
      router.push('/sign-in')
      router.refresh()
    } finally {
      setIsSigning(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-blue-600 font-bold text-2xl">Shop</div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
              Products
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-gray-900 font-medium">
              Cart
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Cart icon */}
            <Link
              href="/cart"
              className="relative text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Sign out button */}
            {session?.user && (
              <>
                <span className="text-sm text-gray-600 hidden sm:inline">{session.user.email}</span>
                <Button
                  onClick={handleSignOut}
                  disabled={isSigning}
                  variant="ghost"
                  size="sm"
                  className="text-gray-700 hover:text-gray-900"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
