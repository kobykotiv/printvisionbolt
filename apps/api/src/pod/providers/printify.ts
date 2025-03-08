import { PodBaseClient } from './base-client';
import { 
  Product, 
  ProductVariant, 
  Order, 
  OrderStatus,
  Address, 
  ShippingMethod,
  ProviderType
} from '../types';

interface PrintifyShippingRate {
  standard: number;
  express: number;
  shipping_time: {
    min: number;
    max: number;
  };
}

interface PrintifyProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  images: Array<{ src: string }>;
  variants: PrintifyVariant[];
  brand_id: string;
  category_id: string;
  tags: string[];
  print_provider_id: string;
  metadata: Record<string, any>;
}

interface PrintifyVariant {
  id: string;
  sku: string;
  title: string;
  price: number;
  options: Record<string, string>;
  is_enabled: boolean;
  is_available: boolean;
  quantity: number;
  print_areas: Array<{
    id: string;
    title: string;
    width: number;
    height: number;
    position: string;
  }>;
  size?: string;
  color?: string;
  metadata?: Record<string, any>;
}

export class PrintifyApiClient extends PodBaseClient {
  constructor(apiKey: string) {
    super(apiKey, 'https://api.printify.com/v1');
  }

  // Products
  public async getProducts(): Promise<Product[]> {
    const response = await this.get<{ data: PrintifyProduct[] }>('/shops/{shop_id}/products.json');
    return response.data.map(this.mapProduct.bind(this));
  }

  public async getProduct(id: string): Promise<Product> {
    const response = await this.get<{ data: PrintifyProduct }>(`/shops/{shop_id}/products/${id}.json`);
    return this.mapProduct(response.data);
  }

  public async getProductVariants(productId: string): Promise<ProductVariant[]> {
    const response = await this.get<{ data: PrintifyVariant[] }>(`/shops/{shop_id}/products/${productId}/variants.json`);
    return response.data.map(this.mapVariant.bind(this));
  }

  // Orders
  public async createOrder(orderData: Partial<Order>): Promise<Order> {
    const printifyOrder = this.mapOrderToPrintify(orderData);
    const response = await this.post<any>('/shops/{shop_id}/orders.json', printifyOrder);
    return this.mapOrderFromPrintify(response.data);
  }

  public async getOrder(id: string): Promise<Order> {
    const response = await this.get<any>(`/shops/{shop_id}/orders/${id}.json`);
    return this.mapOrderFromPrintify(response.data);
  }

  public async calculateShipping(address: Address): Promise<ShippingMethod[]> {
    const response = await this.post<PrintifyShippingRate[]>(
      '/shops/{shop_id}/shipping.json',
      { address }
    );

    return response.map((rate: PrintifyShippingRate) => ({
      id: `printify_${rate.standard ? 'standard' : 'express'}`,
      name: rate.standard ? 'Standard Shipping' : 'Express Shipping',
      carrier: 'Printify',
      service: rate.standard ? 'Standard' : 'Express',
      rate: rate.standard || rate.express,
      currency: 'USD',
      estimatedDays: rate.shipping_time.max,
      metadata: {
        minDays: rate.shipping_time.min,
        maxDays: rate.shipping_time.max
      }
    }));
  }

  // Private mapping methods
  private mapProduct(data: PrintifyProduct): Product {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price,
      images: data.images.map(img => img.src),
      variants: data.variants.map(this.mapVariant.bind(this)),
      metadata: {
        brandId: data.brand_id,
        categoryId: data.category_id,
        tags: data.tags,
        printProvider: data.print_provider_id,
        ...data.metadata
      },
      provider: ProviderType.PRINTIFY
    };
  }

  private mapVariant(data: PrintifyVariant): ProductVariant {
    return {
      id: data.id,
      sku: data.sku,
      title: data.title,
      price: data.price,
      options: data.options,
      inStock: data.is_enabled && data.is_available,
      stockLevel: data.quantity,
      printAreas: data.print_areas.map(area => ({
        id: area.id,
        name: area.title,
        width: area.width,
        height: area.height,
        position: area.position,
        allowedFileTypes: ['png', 'jpg', 'jpeg'],
        dpi: 300
      })),
      metadata: {
        size: data.size,
        color: data.color,
        ...data.metadata
      }
    };
  }

  private mapOrderToPrintify(order: Partial<Order>): any {
    return {
      external_id: order.externalId,
      shipping_method: order.shippingMethod?.service,
      shipping_address: order.shippingAddress,
      line_items: order.items?.map(item => ({
        product_id: item.productId,
        variant_id: item.variantId,
        quantity: item.quantity,
        print_areas: item.printFiles?.map(file => ({
          position: file.position,
          image_url: file.url
        }))
      }))
    };
  }

  private mapOrderFromPrintify(data: any): Order {
    return {
      id: data.id,
      externalId: data.external_id,
      status: this.mapOrderStatus(data.status),
      items: data.line_items.map((item: any) => ({
        productId: item.product_id,
        variantId: item.variant_id,
        quantity: item.quantity,
        printFiles: item.print_areas?.map((area: any) => ({
          url: area.image_url,
          position: area.position,
          type: 'image'
        }))
      })),
      shippingAddress: data.shipping_address,
      billingAddress: data.billing_address,
      shippingMethod: {
        id: data.shipping_method.id,
        name: data.shipping_method.name,
        carrier: 'Printify',
        service: data.shipping_method.type,
        rate: data.shipping_cost,
        currency: 'USD',
        estimatedDays: data.shipping_method.estimated_days
      },
      pricing: {
        subtotal: data.total_price - data.shipping_cost - data.tax_cost,
        shipping: data.shipping_cost,
        tax: data.tax_cost,
        total: data.total_price,
        currency: 'USD',
        breakdown: {
          items: data.total_price - data.shipping_cost - data.tax_cost,
          shipping: data.shipping_cost,
          tax: data.tax_cost,
          discounts: 0
        }
      },
      metadata: {
        printifyId: data.id,
        source: 'printify',
        ...data.metadata
      },
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      provider: ProviderType.PRINTIFY
    };
  }

  private mapOrderStatus(status: string): OrderStatus {
    const statusMap: Record<string, OrderStatus> = {
      'draft': OrderStatus.DRAFT,
      'pending': OrderStatus.PENDING,
      'processing': OrderStatus.PROCESSING,
      'fulfilled': OrderStatus.FULFILLED,
      'shipped': OrderStatus.SHIPPED,
      'delivered': OrderStatus.DELIVERED,
      'canceled': OrderStatus.CANCELLED,
      'failed': OrderStatus.FAILED
    };
    return statusMap[status] || OrderStatus.PENDING;
  }
}