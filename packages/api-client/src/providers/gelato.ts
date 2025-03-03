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

interface GelatoShop {
  id: string;
  name: string;
}

interface GelatoVariant {
  sku: string;
  inStock: number;
  price: number;
  name: string;
}

interface GelatoProduct {
  id: string;
  name: string;
  description: string;
  variants: GelatoVariant[];
  imageUrls: string[];
  status: 'active' | 'inactive' | 'deleted';
}

interface GelatoPaginatedResponse<T> {
  items: T[];
  total: number;
  pageSize: number;
  pageToken?: string;
}

export class GelatoProvider extends BaseProvider {
  private readonly apiUrl = 'https://api.gelato.com/v1';

  constructor(credentials: any) {
    super(credentials);
    this.rateLimiter.minDelay = 750; // Gelato recommends 750ms between requests
  }

  get type(): ProviderType {
    return 'gelato';
  }

  protected async validateCredentials(): Promise<void> {
    try {
      const response = await this.makeRequest<GelatoShop>(`${this.apiUrl}/shop`);
      if (!response?.id) {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw new Error(`Failed to validate Gelato credentials: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getProducts(options?: PaginationOptions): Promise<ProductList> {
    try {
      const limit = options?.limit || 20;
      const pageToken = options?.cursor;

      const response = await this.makeRequest<GelatoPaginatedResponse<GelatoProduct>>(
        `${this.apiUrl}/products?pageSize=${limit}${pageToken ? `&pageToken=${pageToken}` : ''}`
      );

      const items = response.items
        .filter(product => product.status === 'active')
        .map(product => this.mapGelatoProduct(product));

      return {
        items,
        totalCount: response.total,
        hasMore: !!response.pageToken,
        cursor: response.pageToken
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
      let pageToken: string | undefined;

      while (hasMore) {
        const response = await this.makeRequest<GelatoPaginatedResponse<GelatoProduct>>(
          `${this.apiUrl}/products?pageSize=20${pageToken ? `&pageToken=${pageToken}` : ''}`
        );

        for (const product of response.items) {
          try {
            if (product.status === 'deleted') {
              result.removed.push(product.id);
              continue;
            }

            const mappedProduct = this.mapGelatoProduct(product);
            
            if (product.status === 'inactive') {
              // Handle inactive products differently if needed
              continue;
            }

            result.added.push(mappedProduct);
            result.metadata.totalProcessed++;
          } catch (error) {
            result.errors.push({
              productId: product.id,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }

        hasMore = !!response.pageToken;
        pageToken = response.pageToken;

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
      const response = await this.makeRequest<GelatoProduct>(`${this.apiUrl}/products`, {
        method: 'POST',
        body: JSON.stringify({
          name: data.title,
          description: data.description,
          variants: data.variants.map((variant) => ({
            name: variant.title,
            price: variant.price,
            sku: variant.sku,
            options: variant.options
          })),
          imageUrls: data.images
        })
      });

      return response.id;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async syncInventory(productId: string): Promise<InventoryData> {
    try {
      const response = await this.makeRequest<{ variants: GelatoVariant[] }>(
        `${this.apiUrl}/products/${productId}/variants`
      );

      return {
        productId,
        variants: response.variants.map(variant => ({
          sku: variant.sku,
          quantity: variant.inStock
        }))
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createOrder(orderData: OrderData): Promise<string> {
    try {
      const response = await this.makeRequest<{ id: string }>(`${this.apiUrl}/orders`, {
        method: 'POST',
        body: JSON.stringify({
          externalId: orderData.externalId,
          items: orderData.items.map((item) => ({
            productId: item.productId,
            variantSku: item.variantSku,
            quantity: item.quantity
          })),
          shippingAddress: {
            name: orderData.shippingAddress.name,
            addressLine1: orderData.shippingAddress.address1,
            addressLine2: orderData.shippingAddress.address2,
            city: orderData.shippingAddress.city,
            state: orderData.shippingAddress.state,
            country: orderData.shippingAddress.country,
            zipCode: orderData.shippingAddress.zip
          },
          shippingOption: orderData.shippingMethod
        })
      });

      return response.id;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getShippingRates(address: ShippingAddress): Promise<ShippingRate[]> {
    try {
      const response = await this.makeRequest<{ options: Array<{ id: string; name: string; price: number; currency: string; deliveryDays: number }> }>(
        `${this.apiUrl}/shipping/rates`,
        {
          method: 'POST',
          body: JSON.stringify({
            destination: {
              country: address.country,
              state: address.state,
              city: address.city,
              zipCode: address.zip
            }
          })
        }
      );

      return response.options.map(option => ({
        id: option.id,
        name: option.name,
        price: option.price,
        currency: option.currency,
        estimatedDays: option.deliveryDays
      }));
    } catch (error) {
      return this.handleError(error);
    }
  }

  private mapGelatoProduct(product: GelatoProduct): ProviderProduct {
    return {
      id: product.id,
      title: product.name,
      description: product.description,
      variants: product.variants.map(variant => ({
        id: variant.sku,
        sku: variant.sku,
        title: variant.name,
        price: variant.price,
        quantity: variant.inStock,
        metadata: {}
      })),
      images: product.imageUrls,
      metadata: {
        status: product.status
      },
      externalId: product.id,
      providerType: this.type
    };
  }
}