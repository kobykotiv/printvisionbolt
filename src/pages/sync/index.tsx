import React, { useState } from 'react';
import { RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { PageTemplate } from '../../components/ui/PageTemplate';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface SyncOperation {
  id: string;
  storeId: string;
  storeName: string;
  platform: string;
  status: 'pending' | 'success' | 'failed';
  startedAt: string;
  completedAt?: string;
  itemsProcessed: number;
  totalItems: number;
  error?: string;
}

const mockSyncOps: SyncOperation[] = [
  {
    id: '1',
    storeId: 'store1',
    storeName: 'Main Printify Store',
    platform: 'Printify',
    status: 'success',
    startedAt: '2025-02-26T10:30:00Z',
    completedAt: '2025-02-26T10:35:00Z',
    itemsProcessed: 156,
    totalItems: 156
  },
  {
    id: '2',
    storeId: 'store2',
    storeName: 'Printful Store',
    platform: 'Printful',
    status: 'pending',
    startedAt: '2025-02-26T11:00:00Z',
    itemsProcessed: 45,
    totalItems: 89
  },
  {
    id: '3',
    storeId: 'store3',
    storeName: 'Gooten Test Store',
    platform: 'Gooten',
    status: 'failed',
    startedAt: '2025-02-26T09:45:00Z',
    completedAt: '2025-02-26T09:46:00Z',
    itemsProcessed: 20,
    totalItems: 45,
    error: 'API Rate limit exceeded'
  }
];

const SyncStatusPage: React.FC = () => {
  const [isLoading] = useState(false);

  const actions = (
    <Button variant="primary" size="md">
      <RefreshCw className="h-4 w-4 mr-2" />
      Sync All Stores
    </Button>
  );

  const getStatusIcon = (status: SyncOperation['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: SyncOperation['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
    }
  };

  const calculateProgress = (processed: number, total: number) => {
    return Math.round((processed / total) * 100);
  };

  return (
    <PageTemplate
      title="Sync Status"
      description="Monitor and manage your POD store synchronization"
      actions={actions}
      isLoading={isLoading}
    >
      <div className="space-y-6">
        {mockSyncOps.map((op) => (
          <Card key={op.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(op.status)}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{op.storeName}</h3>
                  <p className="text-sm text-gray-500">{op.platform}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(op.status)}`}>
                {op.status}
              </span>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium">
                    {op.itemsProcessed} / {op.totalItems} items
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      op.status === 'failed' ? 'bg-red-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${calculateProgress(op.itemsProcessed, op.totalItems)}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Started</span>
                <span className="font-medium">
                  {new Date(op.startedAt).toLocaleString()}
                </span>
              </div>

              {op.completedAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Completed</span>
                  <span className="font-medium">
                    {new Date(op.completedAt).toLocaleString()}
                  </span>
                </div>
              )}

              {op.error && (
                <div className="mt-2 text-sm text-red-600 bg-red-50 rounded-md p-3">
                  {op.error}
                </div>
              )}
            </div>

            <div className="mt-6 flex space-x-3">
              <Button 
                variant="secondary" 
                size="sm" 
                className="flex-1"
                disabled={op.status === 'pending'}
              >
                View Details
              </Button>
              {op.status === 'failed' && (
                <Button variant="primary" size="sm" className="flex-1">
                  Retry Sync
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </PageTemplate>
  );
};

export default SyncStatusPage;