'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/utils/api/types';
import { trpc } from '@/utils/trpc';

export default function FeaturedProducts() {
  const { data: products, isLoading, error } = trpc.products.getFeatured.useQuery();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse h-80"></div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        Failed to load products. Please try again later.
      </div>
    );
  }

  // Fallback for demo or when API isn't ready
  const demoProducts: Product[] = !products ? [
    {
      id: '1',
      name: 'Business Cards',
      description: 'Premium business cards with various finishes',
      price: 29.99,
      images: ['/images/products/business-cards.jpg'],
      category: 'Business Cards',
      inStock: true
    },
    {
      id: '2',
      name: 'Flyers',
      description: 'High-quality flyers for promotional use',
      price: 39.99,
      images: ['/images/products/flyers.jpg'],
      category: 'Flyers',
      inStock: true
    },
    {
      id: '3',
      name: 'Posters',
      description: 'Large format posters with vibrant colors',
      price: 49.99,
      images: ['/images/products/posters.jpg'],
      category: 'Posters',
      inStock: true
    },
    {
      id: '4',
      name: 'Brochures',
      description: 'Professional brochures with various folding options',
      price: 59.99,
      images: ['/images/products/brochures.jpg'],
      category: 'Brochures',
      inStock: true
    }
  ] : products;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {demoProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
