import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { PodIntegrationConfig, PodProvider, Store } from '../../lib/types/pod';
import { ConnectionStatus } from './ConnectionStatus';
import { getProviderStores } from '../../lib/services/podStoreService';
import { TEST_MODE } from '../../lib/test-mode';

interface ProviderFormProps {
  provider: PodProvider;
  config?: PodIntegrationConfig;
  onSave: (config: PodIntegrationConfig) => Promise<void>;
  onTest: () => Promise<void>;
}

const MOCK_STORES: Record<PodProvider, Store[]> = {
  printify: [
    { id: 'store-1', name: 'My Printify Store 1', provider: 'printify' },
    { id: 'store-2', name: 'My Printify Store 2', provider: 'printify' }
  ],
  printful: [
    { id: 'store-3', name: 'My Printful Store 1', provider: 'printful' },
    { id: 'store-4', name: 'My Printful Store 2', provider: 'printful' }
  ],
  gooten: [
    { id: 'store-5', name: 'My Gooten Store', provider: 'gooten' }
  ],
  gelato: [
    { id: 'store-6', name: 'My Gelato Store', provider: 'gelato' }
  ]
};

export function ProviderForm({
  provider,
  config,
  onSave,
  onTest
}: ProviderFormProps) {
  const [stores, setStores] = React.useState<Store[]>([]);
  const [loadingStores, setLoadingStores] = React.useState(false);

  const { register, handleSubmit, formState: { errors, isDirty }, control } = useForm<PodIntegrationConfig>({
    defaultValues: config || {
      connection: {
        id: '',
        provider,
        apiKey: '',
        environment: 'production',
        isActive: false,
        status: 'disconnected'
      },
      syncSettings: {
        autoSync: true,
        syncInterval: 15,
        syncProducts: true,
        syncInventory: true,
        syncPricing: true,
        notifyOnError: true
      }
    }
  });

  const apiKey = useWatch({
    control,
    name: 'connection.apiKey'
  });

  React.useEffect(() => {
    loadStores();
  }, [provider]);

  const loadStores = async () => {
    setLoadingStores(true);
    try {
      if (!apiKey) {
        setStores([]);
        return;
      }

      if (TEST_MODE) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setStores(MOCK_STORES[provider]);
        return;
      }

      const result = await getProviderStores(provider, apiKey);
      if (result.success && result.store) {
        setStores([result.store]);
      } else {
        setStores([]);
        if (result.error) {
          console.error(`Error loading stores: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Error loading stores:', error);
      setStores([]);
    } finally {
      setLoadingStores(false);
    }
  };

  // Reload stores when API key changes
  React.useEffect(() => {
    if (apiKey) {
      loadStores();
    }
  }, [apiKey]);

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      {/* Connection Settings */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Connection Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              API Key
            </label>
            <input
              type="password"
              {...register('connection.apiKey', { required: 'API key is required' })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.connection?.apiKey && (
              <p className="mt-1 text-sm text-red-600">{errors.connection.apiKey.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Store
            </label>
            <select
              {...register('connection.storeId')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={loadingStores}
            >
              <option value="">Select a store</option>
              {stores.map(store => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
            {loadingStores && (
              <p className="mt-1 text-sm text-gray-500">Loading stores...</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Environment
            </label>
            <select
              {...register('connection.environment')}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="production">Production</option>
              <option value="sandbox">Sandbox</option>
            </select>
          </div>

          {config && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Connection Status
              </label>
              <ConnectionStatus
                connection={config.connection}
                onTest={onTest}
              />
            </div>
          )}
        </div>
      </div>

      {/* Sync Settings */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sync Settings</h3>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                {...register('syncSettings.autoSync')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3">
              <label className="text-sm font-medium text-gray-700">
                Enable Auto-Sync
              </label>
              <p className="text-sm text-gray-500">
                Automatically sync products and inventory
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sync Interval (minutes)
            </label>
            <input
              type="number"
              min="5"
              {...register('syncSettings.syncInterval', {
                min: { value: 5, message: 'Minimum interval is 5 minutes' }
              })}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('syncSettings.syncProducts')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Sync Products
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('syncSettings.syncInventory')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Sync Inventory
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('syncSettings.syncPricing')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Sync Pricing
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isDirty}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}