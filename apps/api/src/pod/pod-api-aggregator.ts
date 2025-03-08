import * as Types from './types';
export * from './types';

import {
  PrintifyApiClient,
  PrintfulApiClient,
  GelatoApiClient,
  GootenApiClient,
  PodBaseClient
} from './providers';

export {
  PrintifyApiClient,
  PrintfulApiClient,
  GelatoApiClient,
  GootenApiClient
};

export class PodAggregator {
  private clients: Map<Types.ProviderType, PodBaseClient> = new Map();

  public registerClient(provider: Types.ProviderType, client: PodBaseClient): void {
    this.clients.set(provider, client);
  }

  public getClient(provider: Types.ProviderType): PodBaseClient | undefined {
    return this.clients.get(provider);
  }

  public getAvailableProviders(): Types.ProviderType[] {
    return Array.from(this.clients.keys());
  }

  public async getAllProducts(): Promise<Record<Types.ProviderType, Types.Product[]>> {
    const results: Partial<Record<Types.ProviderType, Types.Product[]>> = {};
    
    await Promise.all(
      Array.from(this.clients.entries()).map(async ([provider, client]) => {
        try {
          results[provider] = await client.getProducts();
        } catch (error) {
          console.error(`Error fetching products from ${provider}:`, error);
          results[provider] = [];
        }
      })
    );

    return results as Record<Types.ProviderType, Types.Product[]>;
  }

  public async getProduct(provider: Types.ProviderType, id: string): Promise<Types.Product> {
    const client = this.getClientOrThrow(provider);
    return client.getProduct(id);
  }

  public async getProductVariants(
    provider: Types.ProviderType,
    productId: string
  ): Promise<Types.ProductVariant[]> {
    const client = this.getClientOrThrow(provider);
    if ('getProductVariants' in client) {
      return (client as any).getProductVariants(productId);
    }
    throw new Error(`Provider ${provider} does not support variant fetching`);
  }

  public async createOrder(
    provider: Types.ProviderType,
    orderData: Partial<Types.Order>
  ): Promise<Types.Order> {
    const client = this.getClientOrThrow(provider);
    
    // Validate order data
    this.validateOrderData(orderData);
    
    try {
      return await client.createOrder({
        ...orderData,
        provider,
        status: Types.OrderStatus.PENDING,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      throw new Error(`Failed to create order with ${provider}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  public async getOrder(provider: Types.ProviderType, id: string): Promise<Types.Order> {
    const client = this.getClientOrThrow(provider);
    return client.getOrder(id);
  }

  public async compareShippingRates(
    address: Types.Address,
    providers?: Types.ProviderType[]
  ): Promise<Record<Types.ProviderType, Types.ShippingMethod[]>> {
    const targetProviders = providers || this.getAvailableProviders();
    const results: Partial<Record<Types.ProviderType, Types.ShippingMethod[]>> = {};
    
    await Promise.all(
      targetProviders.map(async (provider) => {
        const client = this.clients.get(provider);
        if (!client) return;

        try {
          results[provider] = await client.calculateShipping(address);
        } catch (error) {
          console.error(`Error fetching shipping rates from ${provider}:`, error);
          results[provider] = [];
        }
      })
    );

    return results as Record<Types.ProviderType, Types.ShippingMethod[]>;
  }

  private getClientOrThrow(provider: Types.ProviderType): PodBaseClient {
    const client = this.clients.get(provider);
    if (!client) {
      throw new Error(`Provider ${provider} not found or not configured`);
    }
    return client;
  }

  private validateOrderData(orderData: Partial<Types.Order>): void {
    if (!orderData.shippingAddress) {
      throw new Error('Shipping address is required');
    }

    if (!orderData.items?.length) {
      throw new Error('Order must contain at least one item');
    }

    for (const item of orderData.items) {
      if (!item.productId || !item.variantId || !item.quantity) {
        throw new Error('Invalid order item data');
      }

      if (item.printFiles?.length) {
        this.validatePrintFiles(item.printFiles);
      }
    }
  }

  private validatePrintFiles(files: Types.PrintFile[]): void {
    for (const file of files) {
      if (!file.url || !file.position) {
        throw new Error('Invalid print file data');
      }

      // Validate file URL format
      try {
        new URL(file.url);
      } catch {
        throw new Error(`Invalid file URL: ${file.url}`);
      }
    }
  }

  // Factory method to create an aggregator with all providers
  public static createWithProviders(config: Partial<Record<Types.ProviderType, string>>): PodAggregator {
    const aggregator = new PodAggregator();

    if (config[Types.ProviderType.PRINTIFY]) {
      aggregator.registerClient(
        Types.ProviderType.PRINTIFY,
        new PrintifyApiClient(config[Types.ProviderType.PRINTIFY])
      );
    }

    if (config[Types.ProviderType.PRINTFUL]) {
      aggregator.registerClient(
        Types.ProviderType.PRINTFUL,
        new PrintfulApiClient(config[Types.ProviderType.PRINTFUL])
      );
    }

    if (config[Types.ProviderType.GELATO]) {
      aggregator.registerClient(
        Types.ProviderType.GELATO,
        new GelatoApiClient(config[Types.ProviderType.GELATO])
      );
    }

    if (config[Types.ProviderType.GOOTEN]) {
      aggregator.registerClient(
        Types.ProviderType.GOOTEN,
        new GootenApiClient(config[Types.ProviderType.GOOTEN])
      );
    }

    return aggregator;
  }
}