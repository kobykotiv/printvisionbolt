import React, { useState } from 'react';
import { Store, Plus, RefreshCw } from 'lucide-react';
import { PageTemplate } from '../../components/ui/PageTemplate';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface StoreData {
  id: string;
  name: string;
  platform: 'Printify' | 'Printful' | 'Gooten' | 'Gelato';
  status: 'active' | 'inactive' | 'error';
  lastSync: string;
  productsCount: number;
}

const mockStores: StoreData[] = [
  {
    id: '1',
    name: 'Main Printify Store',
    platform: 'Printify',
    status: 'active',
    lastSync: '2025-02-26T10:30:00Z',
    productsCount: 156
  },
  {
    id: '2',
    name: 'Printful Store',
    platform: 'Printful',
    status: 'active',
    lastSync: '2025-02-26T09:45:00Z',
    productsCount: 89
  },
  {
    id: '3',
    name: 'Gooten Test Store',
    platform: 'Gooten',
    status: 'inactive',
    lastSync: '2025-02-25T15:20:00Z',
    productsCount: 45
  }
];

const StoresPage: React.FC = () => {
  const [isLoading] = useState(false);

  const actions = (
    <>
      <Button variant="secondary" size="md">
        <RefreshCw className="h-4 w-4 mr-2" />
        Sync All
      </Button>
      <Button variant="primary" size="md">
        <Plus className="h-4 w-4 mr-2" />
        Add Store
      </Button>
    </>
  );

  const getStatusColor = (status: StoreData['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      case 'error':
        return 'text-red-600 bg-red-100';
    }
  };

  return (
    <PageTemplate
      title="Stores"
      description="Manage your POD store integrations"
      actions={actions}
      isLoading={isLoading}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockStores.map((store) => (
          <Card key={store.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <Store className="h-8 w-8 text-indigo-600 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{store.name}</h3>
                  <p className="text-sm text-gray-500">{store.platform}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(store.status)}`}>
                {store.status}
              </span>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Products</span>
                <span className="font-medium">{store.productsCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Last Sync</span>
                <span className="font-medium">
                  {new Date(store.lastSync).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <Button variant="secondary" size="sm" className="flex-1">
                View Details
              </Button>
              <Button variant="secondary" size="sm" className="flex-1">
                Sync Now
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </PageTemplate>
  );
};

export default StoresPage;