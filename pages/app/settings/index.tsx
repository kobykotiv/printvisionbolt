import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { PROVIDER_CONFIGS } from '../../../src/features/blueprints/config/providers';
import { configManager } from '../../../src/features/blueprints/config/environment';
import { logger } from '../../../src/features/blueprints/utils/logger';

interface ProviderConfig {
  apiKey: string;
  enabled: boolean;
}

const SettingsPage: React.FC = () => {
  const [configs, setConfigs] = useState<Record<string, ProviderConfig>>(() => {
    const initialConfigs: Record<string, ProviderConfig> = {};
    Object.keys(PROVIDER_CONFIGS).forEach(providerId => {
      initialConfigs[providerId] = {
        apiKey: '',
        enabled: configManager.isProviderEnabled(providerId)
      };
    });
    return initialConfigs;
  });

  const [debugMode, setDebugMode] = useState(configManager.getConfig().features.debugMode);

  const handleProviderConfigChange = (providerId: string, field: keyof ProviderConfig, value: string | boolean) => {
    setConfigs(current => ({
      ...current,
      [providerId]: {
        ...current[providerId],
        [field]: value
      }
    }));
  };

  const handleSaveProviderConfig = async (providerId: string) => {
    const config = configs[providerId];
    try {
      // Save provider configuration
      await configManager.updateProviderConfig(providerId, {
        apiKey: config.apiKey,
        enabled: config.enabled
      });

      logger.info('Provider configuration updated', {
        provider: providerId,
        enabled: config.enabled
      });
    } catch (error) {
      logger.error('Failed to update provider configuration', error as Error);
    }
  };

  const handleToggleDebugMode = () => {
    const newDebugMode = !debugMode;
    setDebugMode(newDebugMode);
    configManager.updateConfig({
      features: {
        ...configManager.getConfig().features,
        debugMode: newDebugMode
      }
    });

    if (newDebugMode) {
      logger.enableDebug();
      logger.debug('Debug mode enabled');
    } else {
      logger.debug('Debug mode disabled');
      logger.disableDebug();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your application settings and provider configurations
          </p>
        </div>

        {/* Provider Configuration */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Provider Configuration</h2>
          <div className="grid gap-6">
            {Object.entries(PROVIDER_CONFIGS).map(([providerId, config]) => (
              <Card key={providerId} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{config.name}</h3>
                    <p className="text-sm text-gray-500">{config.description}</p>
                  </div>
                  <div className="flex items-center">
                    <label className="inline-flex items-center cursor-pointer mr-4">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300"
                        checked={configs[providerId].enabled}
                        onChange={(e) => handleProviderConfigChange(providerId, 'enabled', e.target.checked)}
                      />
                      <span className="ml-2 text-sm text-gray-600">Enabled</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">API Key</label>
                    <Input
                      type="password"
                      value={configs[providerId].apiKey}
                      onChange={(e) => handleProviderConfigChange(providerId, 'apiKey', e.target.value)}
                      placeholder="Enter API key"
                      className="mt-1"
                    />
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    label="Save Configuration"
                    onClick={() => handleSaveProviderConfig(providerId)}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* App Settings */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">App Settings</h2>
          <Card className="p-6">
            <div className="space-y-6">
              {/* Debug Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Debug Mode</h3>
                  <p className="text-sm text-gray-500">
                    Enable detailed logging and performance monitoring
                  </p>
                </div>
                <Button
                  variant={debugMode ? 'primary' : 'outline'}
                  size="sm"
                  label={debugMode ? 'Disable Debug Mode' : 'Enable Debug Mode'}
                  onClick={handleToggleDebugMode}
                />
              </div>

              {/* Cache Settings */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Clear Cache</h3>
                  <p className="text-sm text-gray-500">
                    Reset all cached provider data
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  label="Clear Cache"
                  onClick={() => {
                    logger.info('Cache cleared');
                    // TODO: Implement cache clearing
                  }}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;