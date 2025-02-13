import React, { useEffect } from 'react';
import { RefreshCw, AlertCircle, CheckCircle, Save } from 'lucide-react';
import { ProviderForm } from '../components/pod/ProviderForm'; 
import type { PodIntegrationConfig, PodProvider } from '../lib/types/pod'; 
import { useShop } from '../contexts/ShopContext'; 
import { useSettings } from '../contexts/SettingsContext'; 
import { supabase } from '../lib/supabase'; 

const PROVIDERS: PodProvider[] = ['printify', 'printful', 'gooten', 'gelato'];

export function Settings() {
  const { currentShop } = useShop();
  const { settings, updateSettings, isLoading: settingsLoading } = useSettings();
  const [configs, setConfigs] = React.useState<Record<PodProvider, PodIntegrationConfig | undefined>>({
    printify: undefined,
    printful: undefined,
    gooten: undefined,
    gelato: undefined
  });
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<{
    provider: string;
    status: 'saving' | 'success' | 'error';
    message?: string;
  } | null>(null);

  useEffect(() => {
    if (currentShop) loadConfigurations();
  }, [currentShop]);

  const loadConfigurations = async () => {
    try {
      const { data: integrations, error } = await supabase
        .from('provider_settings')
        .select('*')
        .eq('shop_id', currentShop?.id);

      if (error) throw error;

      const newConfigs = { ...configs };
      integrations?.forEach(settings => {
        newConfigs[settings.provider] = {
          connection: {
            id: settings.id,
            provider: settings.provider,
            apiKey: settings.api_key,
            storeId: settings.store_id,
            environment: settings.environment,
            isActive: true,
            status: settings.status,
            lastSyncedAt: settings.last_synced_at
          },
          syncSettings: settings.settings?.sync || {
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

  const handleSettingChange = async (key: string, value: any) => {
    try {
      setSaving(true);
      await updateSettings({
        ...settings,
        [key]: value
      });
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (provider: PodProvider, config: PodIntegrationConfig) => {
    try {
      setSaveStatus({ provider, status: 'saving' });

      const { error } = await supabase
        .from('provider_settings')
        .upsert({
          shop_id: currentShop?.id,
          provider: provider,
          api_key: config.connection.apiKey,
          store_id: config.connection.storeId,
          environment: config.connection.environment,
          settings: { sync: config.syncSettings }
        });

      if (error) throw error;
      
      setConfigs(prev => ({ ...prev, [provider]: config }));
      setSaveStatus({ provider, status: 'success' });
      
      // Clear success status after 3 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 3000);

    } catch (error) {
      console.error('Error saving configuration:', error);
      setSaveStatus({
        provider,
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to save settings'
      });
      
      // Clear error status after 5 seconds
      setTimeout(() => {
        setSaveStatus(null);
      }, 5000);
    }
  };

  if (loading || settingsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 text-gray-500 animate-spin" />
      </div>
    );
  }

  const renderSaveStatus = (provider: string) => {
    if (!saveStatus || saveStatus.provider !== provider) return null;

    const statusClasses = {
      saving: 'bg-blue-50 text-blue-700',
      success: 'bg-green-50 text-green-700',
      error: 'bg-red-50 text-red-700'
    };

    return (
      <div className={`mt-4 p-3 rounded-md flex items-center ${statusClasses[saveStatus.status]}`}>
        {saveStatus.status === 'saving' && (
          <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
        )}
        {saveStatus.status === 'success' && (
          <CheckCircle className="h-5 w-5 mr-2" />
        )}
        {saveStatus.status === 'error' && (
          <AlertCircle className="h-5 w-5 mr-2" />
        )}
        <span>{saveStatus.message || `${saveStatus.status === 'saving' ? 'Saving' : 'Saved'} ${provider} settings`}</span>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Settings
        </h1>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">General Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Enable Auto-Save</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preview Mode
              </label>
              <select
                value={settings.previewMode}
                onChange={(e) => handleSettingChange('previewMode', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="live">Live</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grid Size
              </label>
              <input
                type="number"
                min="4"
                max="24"
                value={settings.gridSize}
                onChange={(e) => handleSettingChange('gridSize', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notifications
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => handleSettingChange('notifications', {
                      ...settings.notifications,
                      email: e.target.checked
                    })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Email Notifications</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) => handleSettingChange('notifications', {
                      ...settings.notifications,
                      push: e.target.checked
                    })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Push Notifications</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications.desktop}
                    onChange={(e) => handleSettingChange('notifications', {
                      ...settings.notifications,
                      desktop: e.target.checked
                    })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Desktop Notifications</span>
                </label>
              </div>
            </div>
          </div>

          {saving && (
            <div className="mt-4 flex items-center text-sm text-indigo-600">
              <Save className="h-4 w-4 mr-2 animate-spin" />
              Saving changes...
            </div>
          )}
        </div>

        {/* Provider Settings */}
        {PROVIDERS.map(provider => (
          <div
            key={provider}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <h3 className="text-lg font-medium mb-4 text-gray-900">
              {provider} Integration
            </h3>
            {renderSaveStatus(provider)}
            <ProviderForm
              provider={provider}
              config={configs[provider]}
              onSave={(config) => handleSave(provider, config)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
