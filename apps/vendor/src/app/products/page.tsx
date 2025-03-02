'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@printvisionbolt/shared-ui/components/glass';

interface Product {
  id: string;
  name: string;
  price: number;
  status: 'active' | 'draft' | 'archived';
  inventory: number;
  category: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Classic T-Shirt',
    price: 24.99,
    status: 'active',
    inventory: 100,
    category: 'Apparel'
  },
  {
    id: '2',
    name: 'Coffee Mug',
    price: 14.99,
    status: 'active',
    inventory: 50,
    category: 'Home Decor'
  },
  {
    id: '3',
    name: 'Sticker Pack',
    price: 9.99,
    status: 'draft',
    inventory: 200,
    category: 'Stationery'
  }
];

function ProductTable({ products }: { products: Product[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Inventory
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Category
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {product.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  ${product.price.toFixed(2)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${product.status === 'active' ? 'bg-green-100 text-green-800' :
                    product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'}`}>
                  {product.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {product.inventory}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {product.category}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your product catalog</p>
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Add Product
          </button>
        </div>

        <GlassCard>
          <div className="p-6">
            <ProductTable products={mockProducts} />
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}