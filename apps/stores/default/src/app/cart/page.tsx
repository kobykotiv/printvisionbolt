'use client';

import { useCart, CartItem } from '@/hooks/useCart';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartPage() {
  const { items, addItem, removeItem, clearCart, totalItems, totalPrice } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {items.length === 0 ? (
        <div className="text-center text-gray-600">
          Your cart is empty. <Link href="/products" className="text-blue-600 hover:underline">Browse products</Link>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {items.map((item: CartItem) => (
              <div key={item.id} className="flex items-center justify-between border-b border-gray-200 py-4">
                <div className="flex items-center space-x-4">
                  <Link href={`/products/${item.id}`} className="relative w-20 h-20">
                    <Image src={item.imageUrl || ''} alt={item.title} fill className="object-cover rounded" />
                  </Link>
                  <div>
                    <Link href={`/products/${item.id}`} className="block text-lg font-medium hover:underline">{item.title}</Link>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700 transition"
                    aria-label={`Remove ${item.title} from cart`}
                  >
                    <Trash2 size={20} />
                  </button>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => addItem({ ...item, quantity: -1 })}
                      disabled={item.quantity <= 1}
                      className="px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition"
                      aria-label={`Decrease quantity of ${item.title}`}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-2">{item.quantity}</span>
                    <button
                      onClick={() => addItem({ ...item, quantity: 1 })}
                      className="px-2 py-1 hover:bg-gray-100 transition"
                      aria-label={`Increase quantity of ${item.title}`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-between items-center">
            <p className="text-xl font-bold">Total: ${totalPrice.toFixed(2)}</p>
            <Link href="/checkout" className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition">
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}