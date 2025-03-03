import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ExternalLink, AlertCircle } from 'lucide-react';
import { StoreCard } from './StoreCard';
import { storeService } from '../../lib/services/storeService';
import type { Store, StoreProvider } from '../../lib/types/store';

export function StoreSelector() {
  const { data: stores, isLoading, error } = useQuery({
    queryKey: ['stores'],
    queryFn: storeService.getStores
  });

  const [selectedProvider, setSelectedProvider] = React.useState<StoreProvider | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading stores
            </h3>
            <div className="mt-2 text-sm text-red-700">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Provider Selection */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Select a Store Provider
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {['shopify', 'woocommerce', 'printProvider'].map((provider) => (
            <button
              key={provider}
              onClick={() => setSelectedProvider(provider as StoreProvider)}
              className={`
                p-4 border rounded-lg text-left
                ${selectedProvider === provider ? 
                  'border-indigo-500 bg-indigo-50' : 
                  'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <h3 className="font-medium capitalize">{provider}</h3>
              <p className="text-sm text-gray-500 mt-1">
                Connect your {provider} store
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Connected Stores */}
      {stores?.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Connected Stores
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {stores.map((store: Store) => (
              <StoreCard
                key={store.id}
                store={store}
                onSelect={() => {/* Handle store selection */}}
              />
            ))}
          </div>
        </div>
      )}

      {/* Provider-specific Connection Form */}
      {selectedProvider && (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Connect {selectedProvider}
          </h2>
          {/* Render provider-specific connection form */}
          {/* This would be another component based on the selected provider */}
        </div>
      )}
    </div>
  );
}