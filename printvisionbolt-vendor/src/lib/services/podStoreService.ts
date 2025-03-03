import type { PodProvider, Store } from '../types/pod';

interface StoreResponse {
  success: boolean;
  store?: Store;
  error?: string;
  provider: PodProvider;
}

export async function getProviderStores(provider: PodProvider, apiKey: string): Promise<StoreResponse> {
  try {
    switch (provider) {
      case 'printify': {
        const response = await fetch('https://api.printify.com/v1/shops.json', {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Return first store for now - in production, let user select
        const store = data.data[0];
        
        return {
          success: true,
          store: {
            id: store.id.toString(),
            name: store.title,
            provider: 'printify',
            credentials: {
              apiKey
            }
          },
          provider: 'printify'
        };
      }

      case 'printful': {
        const response = await fetch('https://api.printful.com/stores', {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Return first store for now - in production, let user select
        const store = data.result[0];
        
        return {
          success: true,
          store: {
            id: store.id.toString(),
            name: store.name,
            provider: 'printful',
            credentials: {
              apiKey
            }
          },
          provider: 'printful'
        };
      }

      case 'gooten': {
        // Gooten doesn't require store selection
        return {
          success: true,
          store: {
            id: 'gooten-default',
            name: 'Gooten Store',
            provider: 'gooten',
            credentials: {
              apiKey
            }
          },
          provider: 'gooten'
        };
      }

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  } catch (error) {
    // Handle specific error types
    if (error instanceof TypeError) {
      return {
        success: false,
        error: 'Network error. Please check your internet connection.',
        provider
      };
    }

    if (error instanceof Response) {
      if (error.status === 401) {
        return {
          success: false,
          error: 'Invalid API key',
          provider
        };
      }
    }

    // Generic error handling
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      provider
    };
  }
}

export async function validateApiKey(provider: PodProvider, apiKey: string): Promise<boolean> {
  try {
    const result = await getProviderStores(provider, apiKey);
    return result.success;
  } catch {
    return false;
  }
}

export async function getStoreDetails(provider: PodProvider, storeId: string, apiKey: string): Promise<Store | null> {
  try {
    switch (provider) {
      case 'printify': {
        const response = await fetch(`https://api.printify.com/v1/shops/${storeId}.json`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) return null;

        const data = await response.json();
        return {
          id: data.id.toString(),
          name: data.title,
          provider: 'printify',
          credentials: {
            apiKey
          }
        };
      }

      case 'printful': {
        const response = await fetch(`https://api.printful.com/stores/${storeId}`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) return null;

        const data = await response.json();
        return {
          id: data.result.id.toString(),
          name: data.result.name,
          provider: 'printful',
          credentials: {
            apiKey
          }
        };
      }

      case 'gooten': {
        // Gooten always returns the default store
        return {
          id: 'gooten-default',
          name: 'Gooten Store',
          provider: 'gooten',
          credentials: {
            apiKey
          }
        };
      }

      default:
        return null;
    }
  } catch {
    return null;
  }
}