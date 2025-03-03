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

interface PrintifyShop {
  id: string;
  title: string;
}

interface PrintifyVariant {
  id: string;
  sku: string;
  quantity: number;
  price: number;
  title: string;
}

interface PrintifyProduct {
  id: string;
  title: string;
  description: string;
  variants: PrintifyVariant[];
  images: string[];
  is_archived: boolean;
}

interface PrintifyPaginatedResponse<T> {
  current_page: number;
  last_page: number;
  total: number;
  data: T[];
}

export class PrintifyProvider extends BaseProvider {
  private readonly apiUrl = 'https://api.printify.com/v1';
  private readonly shopId: string;

  constructor(credentials: any) {
    super(credentials);
    this.shopId = credentials.shopId;
    this.rateLimiter.minDelay = 500; // Printify has more lenient rate limits
  }

  get type(): ProviderType {
    return 'printify';
  }

  protected async validateCredentials(): Promise<void> {
    try {
      const response = await this.makeRequest<PrintifyShop[]>(`${this.apiUrl}/shops.json`);
      if (!response || response.length === 0) {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw new Error(`Failed to validate Printify credentials: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getProducts(options?: PaginationOptions): Promise<ProductList> {
    try {
      const limit = options?.limit || 20;
      const page = options?.cursor ? parseInt(options.cursor) : 1;

      const response = await this.makeRequest<PrintifyPaginatedResponse<PrintifyProduct>>(
        `${this.apiUrl}/shops/${this.shopId}/products.json?page=${page}&limit=${limit}`
      );

      const items = response.data
        .filter(product => !product.is_archived)
        .map(product => this.mapPrintifyProduct(product));

      return {
        items,
        totalCount: response.total,
        hasMore: page < response.last_page,
        cursor: (page + 1).toString()
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
      let page = 1;
      const limit = 20;

      while (hasMore) {
        const response = await this.makeRequest<PrintifyPaginatedResponse<PrintifyProduct>>(
          `${this.apiUrl}/shops/${this.shopId}/products.json?page=${page}&limit=${limit}`
        );

        for (const product of response.data) {
          try {
            if (product.is_archived) {
              result.removed.push(product.id);
              continue;
            }

            const mappedProduct = this.mapPrintifyProduct(product);
            
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

        hasMore = page < response.last_page;
        page++;

        // Respect rate limits
        await new Promise(resolve => setTimeout(resolve, this.rateLimiter.minDelay));
      }

      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createProduct(data: ProductData): Promise<string> {
    try {
      const response = await this.makeRequest<PrintifyProduct>(`${this.apiUrl}/shops/${this.shopId}/products.json`, {
        method: 'POST',
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          variants: data.variants.map((variant) => ({
            title: variant.title,
            price: variant.price,
            sku: variant.sku,
            options: variant.options
          })),
          images: data.images
        })
      });

      return response.id;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async syncInventory(productId: string): Promise<InventoryData> {
    try {
      const response = await this.makeRequest<{ variants: PrintifyVariant[] }>(
        `${this.apiUrl}/shops/${this.shopId}/products/${productId}/variants.json`
      );

      return {
        productId,
        variants: response.variants.map(variant => ({
          sku: variant.sku,
          quantity: variant.quantity
        }))
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createOrder(orderData: OrderData): Promise<string> {
    try {
      const response = await this.makeRequest<{ id: string }>(`${this.apiUrl}/shops/${this.shopId}/orders.json`, {
        method: 'POST',
        body: JSON.stringify({
          external_id: orderData.externalId,
          line_items: orderData.items.map((item) => ({
            product_id: item.productId,
            variant_id: item.variantSku,
            quantity: item.quantity
          })),
          shipping_address: {
            first_name: orderData.shippingAddress.name.split(' ')[0],
            last_name: orderData.shippingAddress.name.split(' ').slice(1).join(' '),
            address1: orderData.shippingAddress.address1,
            address2: orderData.shippingAddress.address2,
            city: orderData.shippingAddress.city,
            state: orderData.shippingAddress.state,
            country: orderData.shippingAddress.country,
            zip: orderData.shippingAddress.zip
          },
          shipping_method: orderData.shippingMethod
        })
      });

      return response.id;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getShippingRates(address: ShippingAddress): Promise<ShippingRate[]> {
    try {
      const response = await this.makeRequest<{ rates: Array<{ id: string; name: string; price: number; currency: string; estimated_days: number }> }>(
        `${this.apiUrl}/shops/${this.shopId}/shipping/rates.json`,
        {
          method: 'POST',
          body: JSON.stringify({
            address: {
              country: address.country,
              state: address.state,
              city: address.city,
              zip: address.zip
            }
          })
        }
      );

      return response.rates.map(rate => ({
        id: rate.id,
        name: rate.name,
        price: rate.price,
        currency: rate.currency,
        estimatedDays: rate.estimated_days
      }));
    } catch (error) {
      return this.handleError(error);
    }
  }

  private mapPrintifyProduct(product: PrintifyProduct): ProviderProduct {
    return {
      id: product.id,
      title: product.title,
      description: product.description,
      variants: product.variants.map(variant => ({
        id: variant.id,
        sku: variant.sku,
        title: variant.title,
        price: variant.price,
        quantity: variant.quantity,
        metadata: {}
      })),
      images: product.images,
      metadata: {},
      externalId: product.id,
      providerType: this.type
    };
  }
}