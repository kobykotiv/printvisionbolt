import { PROVIDER_CONFIGS } from './providers';

/**
 * Environment configuration interface
 */
export interface EnvironmentConfig {
  providers: {
    [K in keyof typeof PROVIDER_CONFIGS]: {
      apiKey: string;
      enabled: boolean;
      environment: 'production' | 'sandbox';
      webhookSecret?: string;
      customEndpoint?: string;
    };
  };
  features: {
    bulkOperations: boolean;
    cachingEnabled: boolean;
    webhooksEnabled: boolean;
    debugMode: boolean;
  };
  cache: {
    ttl: number;
    maxSize: number;
    staleWhileRevalidate: number;
  };
}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Default configuration values
 */
const defaultConfig: EnvironmentConfig = {
  providers: {
    printify: {
      apiKey: process.env.PRINTIFY_API_KEY || '',
      enabled: true,
      environment: 'production'
    },
    printful: {
      apiKey: process.env.PRINTFUL_API_KEY || '',
      enabled: true,
      environment: 'production'
    },
    gooten: {
      apiKey: process.env.GOOTEN_API_KEY || '',
      enabled: false,
      environment: 'production'
    },
    gelato: {
      apiKey: process.env.GELATO_API_KEY || '',
      enabled: false,
      environment: 'production'
    }
  },
  features: {
    bulkOperations: true,
    cachingEnabled: true,
    webhooksEnabled: true,
    debugMode: process.env.NODE_ENV === 'development'
  },
  cache: {
    ttl: 3600, // 1 hour
    maxSize: 1000, // number of items
    staleWhileRevalidate: 300 // 5 minutes
  }
};

/**
 * Environment configuration manager
 */
class ConfigManager {
  private config: EnvironmentConfig;

  constructor(initialConfig: DeepPartial<EnvironmentConfig> = {}) {
    this.config = this.mergeConfig(defaultConfig, initialConfig);
    this.validateConfig();
  }

  /**
   * Get complete configuration
   */
  getConfig(): EnvironmentConfig {
    return this.config;
  }

  /**
   * Get provider-specific configuration
   */
  getProviderConfig(providerId: keyof typeof PROVIDER_CONFIGS) {
    const providerConfig = this.config.providers[providerId];
    if (!providerConfig) {
      throw new Error(`Provider configuration not found for: ${providerId}`);
    }
    return providerConfig;
  }

  /**
   * Check if a provider is enabled and properly configured
   */
  isProviderEnabled(providerId: keyof typeof PROVIDER_CONFIGS): boolean {
    const config = this.config.providers[providerId];
    return config.enabled && Boolean(config.apiKey);
  }

  /**
   * Get list of currently enabled providers
   */
  getEnabledProviders(): Array<keyof typeof PROVIDER_CONFIGS> {
    return (Object.entries(this.config.providers) as Array<[keyof typeof PROVIDER_CONFIGS, EnvironmentConfig['providers'][keyof typeof PROVIDER_CONFIGS]]>)
      .filter(([, config]) => config.enabled)
      .map(([id]) => id);
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: DeepPartial<EnvironmentConfig>) {
    this.config = this.mergeConfig(this.config, newConfig);
    this.validateConfig();
  }

  /**
   * Update provider configuration
   */
  updateProviderConfig(
    providerId: keyof typeof PROVIDER_CONFIGS,
    config: Partial<EnvironmentConfig['providers'][keyof typeof PROVIDER_CONFIGS]>
  ) {
    this.config.providers[providerId] = {
      ...this.config.providers[providerId],
      ...config
    };
    this.validateConfig();
  }

  /**
   * Validate configuration
   */
  private validateConfig() {
    // Validate provider configurations
    Object.entries(this.config.providers).forEach(([providerId, config]) => {
      if (config.enabled && !config.apiKey) {
        throw new Error(`API key required for enabled provider: ${providerId}`);
      }

      // Validate custom endpoints if provided
      if (config.customEndpoint) {
        try {
          new URL(config.customEndpoint);
        } catch {
          throw new Error(`Invalid custom endpoint for provider: ${providerId}`);
        }
      }

      // Validate webhook secret if webhooks are enabled
      if (this.config.features.webhooksEnabled && config.enabled && !config.webhookSecret) {
        console.warn(`Webhook secret missing for enabled provider: ${providerId}`);
      }
    });

    // Validate cache configuration
    if (this.config.features.cachingEnabled) {
      if (this.config.cache.ttl <= 0) {
        throw new Error('Cache TTL must be positive');
      }
      if (this.config.cache.maxSize <= 0) {
        throw new Error('Cache max size must be positive');
      }
      if (this.config.cache.staleWhileRevalidate < 0) {
        throw new Error('Stale while revalidate must be non-negative');
      }
    }
  }

  /**
   * Deep merge configurations
   */
  private mergeConfig<T extends object>(base: T, override: DeepPartial<T>): T {
    const merged = { ...base };

    Object.keys(override).forEach((key) => {
      const baseValue = base[key as keyof T];
      const overrideValue = override[key as keyof DeepPartial<T>];

      if (
        overrideValue &&
        typeof overrideValue === 'object' &&
        !Array.isArray(overrideValue) &&
        baseValue &&
        typeof baseValue === 'object' &&
        !Array.isArray(baseValue)
      ) {
        merged[key as keyof T] = this.mergeConfig(
          baseValue as object,
          overrideValue as DeepPartial<object>
        ) as T[keyof T];
      } else if (overrideValue !== undefined) {
        merged[key as keyof T] = overrideValue as T[keyof T];
      }
    });

    return merged;
  }
}

// Export singleton instance
export const configManager = new ConfigManager();