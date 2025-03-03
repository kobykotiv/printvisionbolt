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

interface GootenStore {
  id: string;
  name: string;
}

interface GootenVariant {
  id: string;
  sku: string;
  stockLevel: number;
  price: number;
  name: string;
}

interface GootenProduct {
  id: string;
  name: string;
  description: string;
  variants: GootenVariant[];
  images: {
    url: string;
  }[];
  status: 'Active' | 'Inactive' | 'Discontinued';
}

interface GootenPaginatedResponse<T> {
  items: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export class GootenProvider extends BaseProvider {
  private readonly apiUrl = 'https://api.gooten.com/v1';

  constructor(credentials: any) {
    super(credentials);
    this.rateLimiter.minDelay = 600; // Gooten allows slightly more frequent requests
  }

  get type(): ProviderType {
    return 'gooten';
  }

  protected async validateCredentials(): Promise<void> {
    try {
      const response = await this.makeRequest<GootenStore>(`${this.apiUrl}/store`);
      if (!response?.id) {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw new Error(`Failed to validate Gooten credentials: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getProducts(options?: PaginationOptions): Promise<ProductList> {
    try {
      const limit = options?.limit || 20;
      const page = options?.cursor ? parseInt(options.cursor) : 1;

      const response = await this.makeRequest<GootenPaginatedResponse<GootenProduct>>(
        `${this.apiUrl}/products?page=${page}&itemsPerPage=${limit}`
      );

      const items = response.items
        .filter(product => product.status === 'Active')
        .map(product => this.mapGootenProduct(product));

      return {
        items,
        totalCount: response.pagination.totalItems,
        hasMore: page < response.pagination.totalPages,
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
      const itemsPerPage = 20;

      while (hasMore) {
        const response = await this.makeRequest<GootenPaginatedResponse<GootenProduct>>(
          `${this.apiUrl}/products?page=${page}&itemsPerPage=${itemsPerPage}`
        );

        for (const product of response.items) {
          try {
            if (product.status === 'Discontinued') {
              result.removed.push(product.id);
              continue;
            }

            const mappedProduct = this.mapGootenProduct(product);
            
            if (product.status === 'Inactive') {
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

        hasMore = page < response.pagination.totalPages;
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
      const response = await this.makeRequest<GootenProduct>(`${this.apiUrl}/products`, {
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
          images: data.images.map(url => ({ url }))
        })
      });

      return response.id;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async syncInventory(productId: string): Promise<InventoryData> {
    try {
      const response = await this.makeRequest<{ variants: GootenVariant[] }>(
        `${this.apiUrl}/products/${productId}/variants`
      );

      return {
        productId,
        variants: response.variants.map(variant => ({
          sku: variant.sku,
          quantity: variant.stockLevel
        }))
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createOrder(orderData: OrderData): Promise<string> {
    try {
      const response = await this.makeRequest<{ orderId: string }>(`${this.apiUrl}/orders`, {
        method: 'POST',
        body: JSON.stringify({
          externalReference: orderData.externalId,
          items: orderData.items.map((item) => ({
            productId: item.productId,
            variantSku: item.variantSku,
            quantity: item.quantity
          })),
          shippingAddress: {
            name: orderData.shippingAddress.name,
            address1: orderData.shippingAddress.address1,
            address2: orderData.shippingAddress.address2,
            city: orderData.shippingAddress.city,
            state: orderData.shippingAddress.state,
            country: orderData.shippingAddress.country,
            postalCode: orderData.shippingAddress.zip
          },
          shippingMethodId: orderData.shippingMethod
        })
      });

      return response.orderId;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getShippingRates(address: ShippingAddress): Promise<ShippingRate[]> {
    try {
      const response = await this.makeRequest<{ methods: Array<{ id: string; name: string; cost: number; currency: string; transitDays: number }> }>(
        `${this.apiUrl}/shipping/quotes`,
        {
          method: 'POST',
          body: JSON.stringify({
            destination: {
              country: address.country,
              state: address.state,
              city: address.city,
              postalCode: address.zip
            }
          })
        }
      );

      return response.methods.map(method => ({
        id: method.id,
        name: method.name,
        price: method.cost,
        currency: method.currency,
        estimatedDays: method.transitDays
      }));
    } catch (error) {
      return this.handleError(error);
    }
  }

  private mapGootenProduct(product: GootenProduct): ProviderProduct {
    return {
      id: product.id,
      title: product.name,
      description: product.description,
      variants: product.variants.map(variant => ({
        id: variant.id,
        sku: variant.sku,
        title: variant.name,
        price: variant.price,
        quantity: variant.stockLevel,
        metadata: {}
      })),
      images: product.images.map(img => img.url),
      metadata: {
        status: product.status
      },
      externalId: product.id,
      providerType: this.type
    };
  }
}