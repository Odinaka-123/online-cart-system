'use server'

import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { cartItems, products } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const user = await getSession()
  if (!user) throw new Error('Unauthorized')
  return user.id
}
export async function getProducts() {
  return db.select().from(products).orderBy(products.id)
}

export async function getCart() {
  const userId = await getUserId()
  const items = await db
    .select({
      id: cartItems.id,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      product: {
        id: products.id,
        name: products.name,
        price: products.price,
        image: products.image,
      },
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId))

  const total = items.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  )

  return { items, total }
}

export async function addToCart(productId: number) {
  const userId = await getUserId()

  const existing = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)))
    .limit(1)

  if (existing.length > 0) {
    await db
      .update(cartItems)
      .set({ quantity: existing[0].quantity + 1 })
      .where(eq(cartItems.id, existing[0].id))
  } else {
    await db.insert(cartItems).values({
      userId,
      productId,
      quantity: 1,
    })
  }

  revalidatePath('/')
}

export async function updateCartItemQuantity(cartItemId: number, quantity: number) {
  const userId = await getUserId()

  const item = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.id, cartItemId))
    .limit(1)

  if (!item.length || item[0].userId !== userId) {
    throw new Error('Not found')
  }

  if (quantity <= 0) {
    await db.delete(cartItems).where(eq(cartItems.id, cartItemId))
  } else {
    await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, cartItemId))
  }

  revalidatePath('/')
}

export async function removeFromCart(cartItemId: number) {
  const userId = await getUserId()

  const item = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.id, cartItemId))
    .limit(1)

  if (!item.length || item[0].userId !== userId) {
    throw new Error('Not found')
  }

  await db.delete(cartItems).where(eq(cartItems.id, cartItemId))
  revalidatePath('/')
}

export async function clearCart() {
  const userId = await getUserId()
  await db.delete(cartItems).where(eq(cartItems.userId, userId))
  revalidatePath('/')
}
