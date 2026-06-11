'use client'

import Image from 'next/image'
import { Trash2, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { removeFromCart, updateCartItemQuantity } from '@/app/actions/cart'
import { useState } from 'react'

interface CartItemProps {
  item: {
    id: number
    quantity: number
    product: {
      id: number
      name: string
      price: string | number
      image?: string
    }
  }
}

export function CartItem({ item }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const price = parseFloat(String(item.product.price))

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return
    setIsUpdating(true)
    try {
      await updateCartItemQuantity(item.id, newQuantity)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    setIsUpdating(true)
    try {
      await removeFromCart(item.id)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex gap-4 hover:shadow-sm transition-shadow">
      {/* Product Image */}
      {item.product.image ? (
        <div className="relative w-20 h-20 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
          <Image
            src={item.product.image}
            alt={item.product.name}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex-shrink-0 flex items-center justify-center">
          <div className="text-gray-400 text-xs text-center">No image</div>
        </div>
      )}

      {/* Item Details */}
      <div className="flex-grow">
        <h3 className="font-medium text-gray-900 mb-1">{item.product.name}</h3>
        <p className="text-lg font-semibold text-gray-900">${price.toFixed(2)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2 border border-gray-200 rounded px-3 py-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={isUpdating}
          className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center font-medium text-gray-900">{item.quantity}</span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={isUpdating}
          className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Total Price */}
      <div className="text-right">
        <p className="text-sm text-gray-600 mb-2">Total</p>
        <p className="text-lg font-semibold text-gray-900">${(price * item.quantity).toFixed(2)}</p>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        disabled={isUpdating}
        className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
        aria-label="Remove item"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  )
}
