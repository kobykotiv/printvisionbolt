'use client';

import { trpc } from '@/utils/trpc';
import Image from 'next/image';
import { Product } from '@/utils/api/types';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart } from 'lucide-react';

interface Props {
  params: { id: string };
}

export default function ProductDetailPage({ params }: Props) {
  const { id } = params;
  const { data: product, isLoading, error } = trpc.products.byId.useQuery(id);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
        imageUrl: product.images?.[0] || ''
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading product...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        Failed to load product. Please try again later.
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-8">Product not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              width={600}
              height={600}
              className="rounded-lg shadow-md"
            />
          ) : (
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-700 text-lg mb-4">{product.description}</p>
          <p className="text-2xl font-bold text-blue-600 mb-4">${product.price.toFixed(2)}</p>

          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition flex items-center"
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingCart size={18} className="mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}