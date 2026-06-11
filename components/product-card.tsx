'use client'

import { Button } from '@/components/ui/button'
import { addToCart } from '@/app/actions/cart'
import { useState } from 'react'
import Image from 'next/image'

interface ProductCardProps {
  id: number
  name: string
  price: string | number
  image?: string
  description?: string
}

export function ProductCard({ id, name, price, image, description }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      await addToCart(id)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="group flex flex-col rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {image ? (
        <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-gray-400 text-sm">No image</div>
        </div>
      )}

      <div className="flex flex-col flex-grow p-4">
        <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">{name}</h3>
        {description && <p className="text-sm text-gray-600 line-clamp-2 mb-3">{description}</p>}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">${parseFloat(String(price)).toFixed(2)}</span>
        </div>
      </div>

      <div className="p-4 pt-0">
        <Button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  )
}
