import { getSession } from "@/lib/auth";
import { getProducts, getCart } from "@/app/actions/cart";
import { ProductCard } from "@/components/product-card";
import { CartHeader } from "@/components/cart-header";
import Link from "next/link";

export default async function Home() {
  const user = await getSession();
  const products = await getProducts();
  const cart = user ? await getCart() : { items: [] };

  if (user) {
    return (
      <>
        <CartHeader cartCount={cart.items.length} session={{ user }} />
        <main className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
              Featured Products
            </h2>
            {products.length > 0 ?
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
            : <p className="text-gray-500">No products available yet.</p>}
          </div>
        </main>
      </>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <span className="text-xl font-semibold tracking-tight">Shop</span>
        <div className="flex gap-2">
          <Link
            href="/sign-in"
            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-2xl mx-auto text-center px-4 pt-20 pb-16">
        <p className="text-sm font-medium text-emerald-600 uppercase tracking-wider mb-4">
          Premium goods, zero hassle
        </p>
        <h1 className="text-5xl font-semibold tracking-tight text-gray-900 mb-4 leading-tight">
          Your cart, your way
        </h1>
        <p className="text-lg text-gray-500 mb-8 leading-relaxed">
          Browse curated products, add to cart, and check out in seconds. No
          clutter, no confusion.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/sign-up"
            className="px-5 py-2.5 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            Start shopping →
          </Link>
          <Link
            href="/sign-in"
            className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-b border-gray-100">
        {[
          {
            title: "Curated products",
            desc: "Every item is hand-picked for quality and value.",
          },
          {
            title: "Instant cart",
            desc: "Add items and manage your cart in real time.",
          },
          {
            title: "Secure account",
            desc: "Your data stays yours — encrypted, always.",
          },
        ].map((f, i) => (
          <div
            key={i}
            className={`p-8 ${i < 2 ? "border-b sm:border-b-0 sm:border-r border-gray-100" : ""}`}
          >
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              {f.title}
            </h3>
            <p className="text-sm text-gray-500">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Products preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Featured products
          </h2>
          <Link
            href="/sign-up"
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            View all →
          </Link>
        </div>
        {products.length > 0 ?
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 3).map((product) => (
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
        : <p className="text-sm text-gray-400">Products coming soon.</p>}
      </div>

      {/* CTA */}
      <div className="mx-4 sm:mx-8 mb-12 p-10 bg-gray-50 rounded-2xl border border-gray-100 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Ready to shop?
        </h2>
        <p className="text-gray-500 mb-6">
          Create a free account and start adding to your cart today.
        </p>
        <Link
          href="/sign-up"
          className="px-5 py-2.5 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
        >
          Create account
        </Link>
      </div>

      <footer className="px-8 py-5 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm font-semibold tracking-tight">Shop</span>
        <p className="text-xs text-gray-400">
          © 2026 Shop. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
