import React, { useState } from 'react';
import { Box, Filter, ArrowUpDown, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/auth/AuthContext';
import { PageTemplate } from '../../components/ui/PageTemplate';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface Product {
  id: string;
  title: string;
  provider: string;
  blueprint: string;
  status: 'active' | 'draft' | 'archived';
  price: number;
  inventory: number;
  lastUpdated: string;
}

const adminProducts: Product[] = [
  {
    id: '1',
    title: 'Summer Vibes T-Shirt',
    provider: 'Printify',
    blueprint: 'Bella Canvas 3001',
    status: 'active',
    price: 24.99,
    inventory: 999,
    lastUpdated: '2025-02-26T10:30:00Z'
  },
  {
    id: '2',
    title: 'Minimalist Coffee Mug',
    provider: 'Printful',
    blueprint: 'White Ceramic Mug 11oz',
    status: 'draft',
    price: 14.99,
    inventory: 999,
    lastUpdated: '2025-02-25T15:45:00Z'
  },
  {
    id: '3',
    title: 'Adventure Awaits Hoodie',
    provider: 'Gooten',
    blueprint: 'Premium Pullover Hoodie',
    status: 'active',
    price: 39.99,
    inventory: 999,
    lastUpdated: '2025-02-24T09:15:00Z'
  },
  {
    id: '4',
    title: 'Enterprise Collection Bundle',
    provider: 'Multiple',
    blueprint: 'Various',
    status: 'draft',
    price: 199.99,
    inventory: 999,
    lastUpdated: '2025-02-26T11:00:00Z'
  }
];

const regularProducts: Product[] = [
  {
    id: '1',
    title: 'Basic T-Shirt',
    provider: 'Printify',
    blueprint: 'Gildan 5000',
    status: 'active',
    price: 19.99,
    inventory: 999,
    lastUpdated: '2025-02-26T10:00:00Z'
  },
  {
    id: '2',
    title: 'Simple Mug',
    provider: 'Printful',
    blueprint: 'White Ceramic Mug 11oz',
    status: 'active',
    price: 12.99,
    inventory: 999,
    lastUpdated: '2025-02-25T14:30:00Z'
  }
];

const ProductsPage: React.FC = () => {
  const [isLoading] = useState(false);
  const [sortField, setSortField] = useState<keyof Product>('lastUpdated');
  const { isAdmin } = useAuth();
  
  const products = isAdmin ? adminProducts : regularProducts;
  
  const handleSort = (field: keyof Product) => {
    setSortField(field);
  };

  const sortedProducts = [...products].sort((a, b) => {
    const valueA = a[sortField];
    const valueB = b[sortField];
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return valueA.localeCompare(valueB);
    }
    return Number(valueA) - Number(valueB);
  });

  const actions = (
    <>
      <Button variant="secondary" size="md">
        <Filter className="h-4 w-4 mr-2" />
        Filter
      </Button>
      <Button variant="primary" size="md">
        <Plus className="h-4 w-4 mr-2" />
        New Product
      </Button>
    </>
  );

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'draft':
        return 'text-yellow-600 bg-yellow-100';
      case 'archived':
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <PageTemplate
      title="Products"
      description="Manage your print-on-demand products across all providers"
      actions={actions}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('title')}>
                      <span>Product</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('provider')}>
                      <span>Provider/Blueprint</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('status')}>
                      <span>Status</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('price')}>
                      <span>Price</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('lastUpdated')}>
                      <span>Last Updated</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedProducts.map((product: Product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Box className="h-full w-full text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {product.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.provider}</div>
                      <div className="text-sm text-gray-500">{product.blueprint}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(product.lastUpdated).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm" className="ml-2">Preview</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {mockProducts.length} of {mockProducts.length} products
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default ProductsPage;