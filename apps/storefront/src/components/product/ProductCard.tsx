'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/utils/api/types';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  
  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.images[0]
    });
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
      <Link href={`/products/${product.id}`} className="block relative h-48">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="bg-gray-200 h-full w-full flex items-center justify-center">
            <span className="text-gray-500">No image</span>
          </div>
        )}
      </Link>
      
      <div className="p-4">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="text-lg font-medium mb-1">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        </Link>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-blue-600 font-bold">${product.price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
