import type { 
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
} from '../../../api-types/src';
import { BaseProvider } from '../base-provider';

interface PrintfulShop {
  id: string;
  name: string;
}

interface PrintfulVariant {
  id: string;
  sku: string;
  in_stock: number;
  retail_price: string;
  name: string;
}

interface PrintfulProduct {
  id: string;
  name: string;
  variants: PrintfulVariant[];
  thumbnail_url: string;
  description?: string;
  is_ignored: boolean;
}

interface PrintfulPaginatedResponse<T> {
  paging: {
    total: number;
    offset: number;
    limit: number;
  };
  result: T[];
}

export class PrintfulProvider extends BaseProvider {
  private readonly apiUrl = 'https://api.printful.com/v1';
  
  constructor(credentials: any) {
    super(credentials);
    this.rateLimiter.minDelay = 1000; // Printful requires more conservative rate limiting
  }

  get type(): ProviderType {
    return 'printful';
  }

  protected async validateCredentials(): Promise<void> {
    try {
      const response = await this.makeRequest<{ result: PrintfulShop }>(`${this.apiUrl}/store`);
      if (!response?.result) {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw new Error(`Failed to validate Printful credentials: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createProduct(data: ProductData): Promise<string> {
    try {
      const response = await this.makeRequest<{ result: PrintfulProduct }>(`${this.apiUrl}/store/products`, {
        method: 'POST',
        body: JSON.stringify({
          name: data.title,
          variants: data.variants.map((variant) => ({
            name: variant.title,
            retail_price: variant.price,
            sku: variant.sku,
            options: variant.options
          }))
        })
      });

      return response.result.id;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getProducts(options?: PaginationOptions): Promise<ProductList> {
    try {
      const limit = options?.limit || 20;
      const offset = options?.cursor ? parseInt(options.cursor) : 0;

      const response = await this.makeRequest<PrintfulPaginatedResponse<PrintfulProduct>>(
        `${this.apiUrl}/store/products?offset=${offset}&limit=${limit}`
      );

      const items = response.result.map(product => this.mapPrintfulProduct(product));
      
      return {
        items,
        totalCount: response.paging.total,
        hasMore: offset + limit < response.paging.total,
        cursor: (offset + limit).toString()
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async syncProducts(): Promise<SyncResult> {
    const result: SyncResult = {
      added: [],
      updated: [],
      removed: [],
      errors: [],
      metadata: {
        totalProcessed: 0,
        lastSyncedAt: new Date().toISOString()
      }
    };

    try {
      let hasMore = true;
      let offset = 0;
      const limit = 20;

      while (hasMore) {
        const response = await this.makeRequest<PrintfulPaginatedResponse<PrintfulProduct>>(
          `${this.apiUrl}/store/products?offset=${offset}&limit=${limit}`
        );

        for (const product of response.result) {
          try {
            if (product.is_ignored) {
              result.removed.push(product.id);
              continue;
            }

            const mappedProduct = this.mapPrintfulProduct(product);
            
            // In a real implementation, you would check against your database
            // and determine if this is a new or updated product
            // For now, we'll just add it to the added array
            result.added.push(mappedProduct);
            result.metadata.totalProcessed++;
          } catch (error) {
            result.errors.push({
              productId: product.id,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }

        hasMore = offset + limit < response.paging.total;
        offset += limit;

        // Respect rate limits
        await new Promise(resolve => setTimeout(resolve, this.rateLimiter.minDelay));
      }

      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async syncInventory(productId: string): Promise<InventoryData> {
    try {
      const response = await this.makeRequest<{ result: { variants: PrintfulVariant[] } }>(
        `${this.apiUrl}/store/products/${productId}/variants`
      );
      
      return {
        productId,
        variants: response.result.variants.map(variant => ({
          sku: variant.sku,
          quantity: variant.in_stock
        }))
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createOrder(orderData: OrderData): Promise<string> {
    try {
      const response = await this.makeRequest<{ result: { id: string } }>(`${this.apiUrl}/orders`, {
        method: 'POST',
        body: JSON.stringify({
          external_id: orderData.externalId,
          items: orderData.items.map((item) => ({
            sync_variant_id: item.variantSku,
            quantity: item.quantity
          })),
          recipient: {
            name: orderData.shippingAddress.name,
            address1: orderData.shippingAddress.address1,
            address2: orderData.shippingAddress.address2,
            city: orderData.shippingAddress.city,
            state_code: orderData.shippingAddress.state,
            country_code: orderData.shippingAddress.country,
            zip: orderData.shippingAddress.zip
          },
          shipping: orderData.shippingMethod
        })
      });

      return response.result.id;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getShippingRates(address: ShippingAddress): Promise<ShippingRate[]> {
    try {
      const response = await this.makeRequest<{ result: Array<{ id: string; name: string; rate: number; currency: string; minDeliveryDays: number }> }>(
        `${this.apiUrl}/shipping/rates`,
        {
          method: 'POST',
          body: JSON.stringify({
            recipient: {
              country_code: address.country,
              state_code: address.state,
              city: address.city,
              zip: address.zip
            }
          })
        }
      );

      return response.result.map(rate => ({
        id: rate.id,
        name: rate.name,
        price: rate.rate,
        currency: rate.currency,
        estimatedDays: rate.minDeliveryDays
      }));
    } catch (error) {
      return this.handleError(error);
    }
  }

  private mapPrintfulProduct(product: PrintfulProduct): ProviderProduct {
    return {
      id: product.id,
      title: product.name,
      description: product.description,
      variants: product.variants.map(variant => ({
        id: variant.id,
        sku: variant.sku,
        title: variant.name,
        price: parseFloat(variant.retail_price),
        quantity: variant.in_stock,
        metadata: {}
      })),
      images: [product.thumbnail_url],
      metadata: {},
      externalId: product.id,
      providerType: this.type
    };
  }
}