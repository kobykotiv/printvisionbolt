import { supabase } from '../supabase';
import type { PodProvider } from '../types/pod';

interface ProductCreatePayload {
  title: string;
  description?: string;
  price: number;
  provider: PodProvider;
  providerId: string;
  variants: ProductVariant[];
  printAreas: PrintArea[];
  status: 'draft' | 'active' | 'archived';
}

interface ProductVariant {
  sku: string;
  color: string;
  size: string;
  price: number;
  stock: number;
}

interface PrintArea {
  name: string;
  width: number;
  height: number;
  position: {
    x: number;
    y: number;
  };
}

interface SyncProductPayload {
  productId: string;
  provider: PodProvider;
  data: Record<string, any>;
}

class ProductService {
  async createProduct(shopId: string, payload: ProductCreatePayload) {
    try {
      // Create product record
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          shop_id: shopId,
          title: payload.title,
          description: payload.description,
          status: payload.status,
          provider: payload.provider,
          provider_id: payload.providerId,
          variants: payload.variants,
          print_areas: payload.printAreas,
          pricing: {
            base_price: payload.price,
            currency: 'USD'
          }
        })
        .select()
        .single();

      if (productError) throw productError;

      // Sync with provider
      await this.syncWithProvider({
        productId: product.id,
        provider: payload.provider,
        data: {
          title: payload.title,
          description: payload.description,
          variants: payload.variants,
          printAreas: payload.printAreas
        }
      });

      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async syncWithProvider(payload: SyncProductPayload) {
    try {
      switch (payload.provider) {
        case 'printify': {
          // POST /v1/shops/{shop_id}/products.json
          const response = await fetch(`https://api.printify.com/v1/shops/${payload.productId}/products.json`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload.data)
          });

          if (!response.ok) throw new Error('Failed to sync with Printify');
          break;
        }

        case 'printful': {
          // POST /sync/products
          const response = await fetch('https://api.printful.com/sync/products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload.data)
          });

          if (!response.ok) throw new Error('Failed to sync with Printful');
          break;
        }

        case 'gooten': {
          // POST /print-ready-products
          const response = await fetch('https://api.gooten.com/v1/print-ready-products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload.data)
          });

          if (!response.ok) throw new Error('Failed to sync with Gooten');
          break;
        }
      }

      // Log successful sync
      await supabase.from('sync_logs').insert({
        product_id: payload.productId,
        provider: payload.provider,
        status: 'success'
      });

    } catch (error) {
      // Log sync error
      await supabase.from('sync_logs').insert({
        product_id: payload.productId,
        provider: payload.provider,
        status: 'error',
        error_message: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  async searchProducts(shopId: string, query: string, filters: {
    status?: string[];
    provider?: PodProvider[];
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  } = {}, page = 1, limit = 20) {
    try {
      let queryBuilder = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });

      // Full-text search
      if (query) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      }

      // Apply filters
      if (filters.status?.length) {
        queryBuilder = queryBuilder.in('status', filters.status);
      }

      if (filters.provider?.length) {
        queryBuilder = queryBuilder.in('provider', filters.provider);
      }

      if (filters.minPrice) {
        queryBuilder = queryBuilder.gte('pricing->base_price', filters.minPrice);
      }

      if (filters.maxPrice) {
        queryBuilder = queryBuilder.lte('pricing->base_price', filters.maxPrice);
      }

      if (filters.inStock) {
        queryBuilder = queryBuilder.gt('variants[0]->stock', 0);
      }

      // Add pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      queryBuilder = queryBuilder.range(from, to);

      const { data, error, count } = await queryBuilder;

      if (error) throw error;

      return {
        data,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: count ? Math.ceil(count / limit) : 0
        }
      };
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  async getProductStats(shopId: string) {
    try {
      const { data, error } = await supabase.rpc('get_product_stats', {
        p_shop_id: shopId
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error getting product stats:', error);
      throw error;
    }
  }
}

export const productService = new ProductService();