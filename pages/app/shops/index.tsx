import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { logger } from '../../../src/features/blueprints/utils/logger';
import { metricsCollector } from '../../../src/features/blueprints/utils/metrics';
import { PROVIDER_CONFIGS } from '../../../src/features/blueprints/config/providers';

interface Shop {
  id: string;
  name: string;
  provider: string;
  status: 'active' | 'disconnected' | 'error';
  lastSync?: Date;
  productsCount: number;
  ordersCount: number;
  error?: string;
}

const mockShops: Shop[] = [
  {
    id: '1',
    name: 'My Printful Store',
    provider: 'printful',
    status: 'active',
    lastSync: new Date(),
    productsCount: 45,
    ordersCount: 12
  },
  {
    id: '2',
    name: 'Printify Shop',
    provider: 'printify',
    status: 'active',
    lastSync: new Date(),
    productsCount: 32,
    ordersCount: 8
  }
];

const ShopCard: React.FC<{ shop: Shop }> = ({ shop }) => {
  const getStatusColor = (status: Shop['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'disconnected':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
    }
  };

  const report = metricsCollector.generateReport(shop.provider);
  const healthScore = report.metrics?.successRate ?? 0;

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-gray-900">{shop.name}</h3>
            <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium capitalize border ${getStatusColor(shop.status)}`}>
              {shop.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Connected to {PROVIDER_CONFIGS[shop.provider]?.name || shop.provider}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          label="Settings"
          onClick={() => {
            logger.debug('Shop settings clicked', { shopId: shop.id });
          }}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Products</div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">{shop.productsCount}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500">Orders</div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">{shop.ordersCount}</div>
        </div>
      </div>

      {/* Health Status */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">Provider Health</span>
          <span className={`text-sm font-medium ${
            healthScore >= 98 ? 'text-green-600' :
            healthScore >= 90 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {healthScore.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`rounded-full h-2 ${
              healthScore >= 98 ? 'bg-green-500' :
              healthScore >= 90 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${Math.min(100, healthScore)}%` }}
          />
        </div>
        {shop.lastSync && (
          <p className="text-xs text-gray-500 mt-2">
            Last synced: {shop.lastSync.toLocaleString()}
          </p>
        )}
      </div>
    </Card>
  );
};

const ShopsPage: React.FC = () => {
  const [isAddingShop, setIsAddingShop] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Print Shops</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your connected print-on-demand shops
              </p>
            </div>
            <Button
              variant="primary"
              label="Add Shop"
              onClick={() => setIsAddingShop(true)}
            />
          </div>
        </div>

        {/* Shops Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockShops.map(shop => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>

        {/* Empty State */}
        {mockShops.length === 0 && (
          <Card className="p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No shops connected</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by connecting your first print-on-demand shop
            </p>
            <div className="mt-6">
              <Button
                variant="primary"
                label="Connect Shop"
                onClick={() => {
                  setIsAddingShop(true);
                  logger.debug('Connect shop clicked (empty state)');
                }}
              />
            </div>
          </Card>
        )}

        {/* Add Shop Modal */}
        {isAddingShop && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Add New Shop</h2>
                  <p className="text-sm text-gray-500">Connect a print-on-demand provider</p>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setIsAddingShop(false)}
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {Object.entries(PROVIDER_CONFIGS).map(([id, config]) => (
                  <Button
                    key={id}
                    variant="outline"
                    label={`Connect ${config.name}`}
                    onClick={() => {
                      logger.debug('Provider selected', { providerId: id });
                      setIsAddingShop(false);
                      // TODO: Implement provider connection flow
                    }}
                    className="w-full justify-center"
                  />
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopsPage;