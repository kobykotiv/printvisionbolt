import React from 'react';
import { RefreshCw } from 'lucide-react';
import { ProviderForm } from '../components/pod/ProviderForm';
import type { PodIntegrationConfig, PodProvider } from '../lib/types/pod';
import { useShop } from '../contexts/ShopContext';
import { useSettings } from '../contexts/SettingsContext';
import { supabase } from '../lib/supabase';
import { TEST_MODE } from '../lib/test-mode';

const PROVIDERS: PodProvider[] = ['printify', 'printful', 'gooten', 'gelato'];

export function Settings() {
  const { currentShop } = useShop();
  const { darkMode } = useSettings();
  const [configs, setConfigs] = React.useState<Record<PodProvider, PodIntegrationConfig | undefined>>({
    printify: undefined,
    printful: undefined,
    gooten: undefined,
    gelato: undefined
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (currentShop) loadConfigurations();
  }, [currentShop]);

  const loadConfigurations = async () => {
    try {
      if (TEST_MODE) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setConfigs({
          printify: {
            connection: {
              id: 'test-1',
              provider: 'printify',
              apiKey: '********',
              storeId: 'store-1',
              environment: 'production',
              isActive: true,
              status: 'connected',
              lastSyncedAt: new Date().toISOString()
            },
            syncSettings: {
              autoSync: true,
              syncInterval: 15,
              syncProducts: true,
              syncInventory: true,
              syncPricing: true,
              notifyOnError: true
            }
          },
          printful: undefined,
          gooten: undefined,
          gelato: undefined
        });
        setLoading(false);
        return;
      }

      const { data: integrations, error } = await supabase
        .from('supplier_integrations')
        .select('*')
        .eq('shop_id', currentShop?.id);

      if (error) throw error;

      const newConfigs = { ...configs };
      integrations.forEach(integration => {
        newConfigs[integration.supplier as PodProvider] = {
          connection: {
            id: integration.id,
            provider: integration.supplier as PodProvider,
            apiKey: integration.api_key,
            storeId: integration.settings?.store_id,
            environment: integration.settings?.environment || 'production',
            isActive: true,
            status: 'connected',
            lastSyncedAt: integration.updated_at
          },
          syncSettings: integration.settings?.sync || {
            autoSync: true,
            syncInterval: 15,
            syncProducts: true,
            syncInventory: true,
            syncPricing: true,
            notifyOnError: true
          }
        };
      });

      setConfigs(newConfigs);
    } catch (error) {
      console.error('Error loading configurations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (provider: PodProvider, config: PodIntegrationConfig) => {
    try {
      if (TEST_MODE) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setConfigs(prev => ({ ...prev, [provider]: config }));
        return;
      }

      const { error } = await supabase
        .from('supplier_integrations')
        .upsert({
          shop_id: currentShop?.id,
          supplier: provider,
          api_key: config.connection.apiKey,
          settings: {
            store_id: config.connection.storeId,
            environment: config.connection.environment,
            sync: config.syncSettings
          }
        });

      if (error) throw error;
      setConfigs(prev => ({ ...prev, [provider]: config }));
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className={`h-8 w-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'} animate-spin`} />
      </div>
    );
  }

  return (
    <div className={`${darkMode ? 'text-gray-100' : 'text-gray-900'} p-6`}>
      <div className="mb-8">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Settings
        </h1>
      </div>

      <div className="space-y-6">
        {PROVIDERS.map(provider => (
          <div
            key={provider}
            className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} 
            rounded-lg shadow-sm border p-6 transition-colors duration-200`}
          >
            <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              {provider} Integration
            </h3>
            <ProviderForm
              provider={provider}
              config={configs[provider]}
              onSave={(config) => handleSave(provider, config)}
              darkMode={darkMode}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
