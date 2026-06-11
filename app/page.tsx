import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getProducts, getCart } from '@/app/actions/cart'
import { ProductCard } from '@/components/product-card'
import { CartHeader } from '@/components/cart-header'

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  const products = await getProducts()
  const cart = await getCart()

  return (
    <>
      <CartHeader cartCount={cart.items.length} session={session} />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Welcome to Shop
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our curated selection of premium products. Shop with confidence with our clean and minimal design.
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Products</h2>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image || undefined}
                  description={product.description || undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No products available</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
