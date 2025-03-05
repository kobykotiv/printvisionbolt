'use client';

import { useState } from 'react';
import { trpc } from '@/utils/trpc';
import ProductCard from '@/components/product/ProductCard';
import { SearchIcon } from 'lucide-react';
import { Product } from '@/utils/api/types';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, error } = trpc.products.list.useQuery();
  const products = data?.items;

  // Filter products based on search
  const filteredProducts = products?.filter((product: Product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse h-80" />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center text-red-600 py-8">
          Failed to load products. Please try again later.
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && !error && (
        <>
          {filteredProducts?.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              No products found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts?.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}