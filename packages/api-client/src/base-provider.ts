import type { 
  PrintProvider,
  ProviderCredentials,
  ProviderType,
  ProductData,
  InventoryData,
  OrderData,
  ShippingAddress,
  ShippingRate,
  ProductList,
  SyncResult,
  PaginationOptions,
  ProviderProduct
} from '../../api-types/src';

export abstract class BaseProvider implements PrintProvider {
  protected credentials: ProviderCredentials;
  protected rateLimiter = {
    lastRequest: 0,
    minDelay: 500 // 500ms between requests by default
  };

  constructor(credentials: ProviderCredentials) {
    this.credentials = credentials;
  }

  abstract get type(): ProviderType;

  async initialize(credentials: ProviderCredentials): Promise<void> {
    this.credentials = credentials;
    await this.validateCredentials();
  }

  protected abstract validateCredentials(): Promise<void>;
  
  abstract createProduct(data: ProductData): Promise<string>;
  
  abstract syncInventory(productId: string): Promise<InventoryData>;
  
  abstract createOrder(orderData: OrderData): Promise<string>;
  
  abstract getShippingRates(address: ShippingAddress): Promise<ShippingRate[]>;

  // New abstract methods for MVP
  abstract getProducts(options?: PaginationOptions): Promise<ProductList>;
  abstract syncProducts(): Promise<SyncResult>;

  protected async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Implement rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.rateLimiter.lastRequest;
    if (timeSinceLastRequest < this.rateLimiter.minDelay) {
      await new Promise(resolve => 
        setTimeout(resolve, this.rateLimiter.minDelay - timeSinceLastRequest)
      );
    }
    this.rateLimiter.lastRequest = Date.now();

    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.credentials.apiKey}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Provider API error: ${response.statusText}`);
    }

    return response.json();
  }

  protected handleError(error: unknown): never {
    if (error instanceof Error) {
      throw new Error(`Provider error (${this.type}): ${error.message}`);
    }
    throw new Error(`Unknown provider error (${this.type})`);
  }

  // Helper method for product comparison
  protected compareProducts(local: ProviderProduct, remote: ProviderProduct): boolean {
    if (local.title !== remote.title) return false;
    if (local.description !== remote.description) return false;
    
    // Compare variants
    if (local.variants.length !== remote.variants.length) return false;
    for (let i = 0; i < local.variants.length; i++) {
      const localVariant = local.variants[i];
      const remoteVariant = remote.variants[i];
      if (
        localVariant.sku !== remoteVariant.sku ||
        localVariant.title !== remoteVariant.title ||
        localVariant.price !== remoteVariant.price
      ) {
        return false;
      }
    }
    
    return true;
  }
}