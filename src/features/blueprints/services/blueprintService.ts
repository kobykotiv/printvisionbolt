import { PrintifyAdapter } from './adapters/printifyAdapter';
import { PrintfulAdapter } from './adapters/printfulAdapter';
import { 
  Blueprint, 
  BlueprintSearchParams, 
  BlueprintSearchResult 
} from '../types/blueprint';
import { 
  PrintProvider, 
  ProviderConfig,
  ValidationResult 
} from '../types/provider';
import { 
  BlueprintError,
  ProviderUnavailableError
} from '../types/errors';
import { configManager } from '../config/environment';
import { PROVIDER_CONFIGS, getProviderConfig } from '../config/providers';

export class BlueprintService {
  private providers: Map<string, PrintProvider>;
  private initialized: boolean;

  constructor() {
    this.providers = new Map();
    this.initialized = false;
  }

  /**
   * Initialize the service with provider configurations
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    // Initialize enabled providers
    const enabledProviders = configManager.getEnabledProviders();
    
    for (const providerId of enabledProviders) {
      const envConfig = configManager.getProviderConfig(providerId);
      const providerConfig = getProviderConfig(providerId);
      
      if (envConfig.apiKey) {
        const config: ProviderConfig = {
          apiKey: envConfig.apiKey,
          baseUrl: envConfig.customEndpoint || providerConfig.endpoints.base,
          timeout: 30000, // 30 seconds
          retry: {
            maxRetries: 3,
            retryDelay: 1000,
            retryableStatuses: [408, 429, 500, 502, 503, 504]
          },
          cache: {
            ttl: configManager.getConfig().cache.ttl,
            staleWhileRevalidate: configManager.getConfig().cache.staleWhileRevalidate
          }
        };

        await this.registerProvider(providerId, config);
      }
    }

    this.initialized = true;
  }

  /**
   * Register a new provider with the service
   */
  private async registerProvider(
    providerId: keyof typeof PROVIDER_CONFIGS,
    config: ProviderConfig
  ): Promise<void> {
    let provider: PrintProvider;

    switch (providerId) {
      case 'printify':
        provider = new PrintifyAdapter(config);
        break;
      case 'printful':
        provider = new PrintfulAdapter(config);
        break;
      default:
        throw new Error(`Unsupported provider type: ${providerId}`);
    }

    // Verify provider availability before registering
    try {
      const isAvailable = await provider.checkAvailability();
      if (!isAvailable) {
        throw new ProviderUnavailableError(providerId);
      }
    } catch (error) {
      console.error(`Failed to initialize provider ${providerId}:`, error);
      return;
    }

    this.providers.set(provider.id, provider);
  }

  /**
   * Get all registered providers
   */
  getProviders(): PrintProvider[] {
    this.ensureInitialized();
    return Array.from(this.providers.values());
  }

  /**
   * Get a specific provider by ID
   */
  getProvider(providerId: string): PrintProvider {
    this.ensureInitialized();
    const provider = this.providers.get(providerId);
    if (!provider) {
      throw new Error(`Provider not found: ${providerId}`);
    }
    return provider;
  }

  /**
   * Search blueprints across all providers or a specific provider
   */
  async searchBlueprints(
    params: BlueprintSearchParams & { providerId?: string }
  ): Promise<BlueprintSearchResult> {
    this.ensureInitialized();

    if (params.providerId) {
      return this.searchProviderBlueprints(params.providerId, params);
    }

    const results = await Promise.allSettled(
      Array.from(this.providers.values()).map(provider =>
        this.searchProviderBlueprints(provider.id, params)
      )
    );

    const successfulResults = results
      .filter((result): result is PromiseFulfilledResult<BlueprintSearchResult> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);

    if (successfulResults.length === 0) {
      throw new Error('Failed to fetch blueprints from all providers');
    }

    return this.mergeSearchResults(successfulResults);
  }

  /**
   * Get detailed blueprint information
   */
  async getBlueprintDetails(providerId: string, blueprintId: string): Promise<Blueprint> {
    this.ensureInitialized();
    const provider = this.getProvider(providerId);
    
    try {
      const isAvailable = await provider.checkAvailability();
      if (!isAvailable) {
        throw new ProviderUnavailableError(providerId);
      }

      return await provider.fetchBlueprintDetails(blueprintId);
    } catch (error) {
      if (error instanceof BlueprintError) {
        throw error;
      }
      throw new Error(`Failed to fetch blueprint details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate blueprint data
   */
  async validateBlueprint(
    providerId: string, 
    blueprint: Partial<Blueprint>
  ): Promise<ValidationResult> {
    this.ensureInitialized();
    const provider = this.getProvider(providerId);
    return provider.validateBlueprint(blueprint);
  }

  /**
   * Check availability of all providers or a specific provider
   */
  async checkAvailability(providerId?: string): Promise<Map<string, boolean>> {
    this.ensureInitialized();
    const providers = providerId 
      ? [this.getProvider(providerId)]
      : this.getProviders();

    const results = new Map<string, boolean>();

    await Promise.all(
      providers.map(async provider => {
        try {
          results.set(provider.id, await provider.checkAvailability());
        } catch {
          results.set(provider.id, false);
        }
      })
    );

    return results;
  }

  /**
   * Ensure service is initialized before use
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('BlueprintService must be initialized before use');
    }
  }

  /**
   * Search blueprints from a specific provider
   */
  private async searchProviderBlueprints(
    providerId: string,
    params: BlueprintSearchParams
  ): Promise<BlueprintSearchResult> {
    const provider = this.getProvider(providerId);
    
    try {
      const isAvailable = await provider.checkAvailability();
      if (!isAvailable) {
        throw new ProviderUnavailableError(providerId);
      }

      return await provider.fetchBlueprints(params);
    } catch (error) {
      if (error instanceof BlueprintError) {
        throw error;
      }
      throw new Error(`Failed to fetch blueprints from ${providerId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Merge search results from multiple providers
   */
  private mergeSearchResults(results: BlueprintSearchResult[]): BlueprintSearchResult {
    const items = results.flatMap(result => result.items);
    const total = results.reduce((sum, result) => sum + result.total, 0);
    const page = results[0]?.page || 1;
    const limit = results[0]?.limit || 20;

    return {
      items,
      total,
      page,
      limit,
      hasMore: results.some(result => result.hasMore)
    };
  }
}

// Export singleton instance
export const blueprintService = new BlueprintService();