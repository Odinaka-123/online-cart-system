import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCart } from "@/app/actions/cart";
import { CartHeader } from "@/components/cart-header";
import { CartItem } from "@/components/cart-item";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CartPage() {
  const user = await getSession();
  if (!user) redirect("/sign-in");

  const cart = await getCart();

  return (
    <>
      <CartHeader cartCount={cart.items.length} session={{ user }} />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-2">
              {cart.items.length} items in cart
            </p>
          </div>

          {cart.items.length > 0 ?
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={{
                      ...item,
                      product: {
                        ...item.product,
                        image: item.product.image ?? undefined,
                      },
                    }}
                  />
                ))}
              </div>
              <div className="lg:col-span-1">
                <div className="sticky top-20 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Order Summary
                  </h2>
                  <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span>${cart.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Tax (estimated)</span>
                      <span>${(cart.total * 0.08).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${(cart.total * 1.08).toFixed(2)}
                    </span>
                  </div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors mb-3">
                    Proceed to Checkout
                  </button>
                  <Link href="/">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          : <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6">
                Start shopping to add items to your cart
              </p>
              <Link href="/">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          }
        </div>
      </main>
    </>
  );
}
