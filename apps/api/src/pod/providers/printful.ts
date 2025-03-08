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

interface PrintfulProduct {
  id: string;
  name: string;
  synced: boolean;
  variants: PrintfulVariant[];
  sync_variants: PrintfulSyncVariant[];
  retail_price: number;
  files: PrintfulFile[];
}

interface PrintfulVariant {
  id: string;
  variant_id: string;
  product_id: string;
  name: string;
  size: string;
  color: string;
  price: number;
  in_stock: boolean;
  sku: string;
}

interface PrintfulSyncVariant {
  id: string;
  variant_id: number;
  retail_price: number;
  files: PrintfulFile[];
}

interface PrintfulFile {
  id: string;
  type: string;
  url: string;
  filename: string;
  position: string;
  preview_url: string;
}

interface PrintfulShippingRate {
  id: string;
  name: string;
  rate: number;
  currency: string;
  minDeliveryDays: number;
  maxDeliveryDays: number;
}

export class PrintfulApiClient extends PodBaseClient {
  constructor(apiKey: string) {
    super(apiKey, 'https://api.printful.com');
  }

  public async getProducts(): Promise<Product[]> {
    const response = await this.get<{ result: PrintfulProduct[] }>('/store/products');
    return response.result.map(this.mapProduct.bind(this));
  }

  public async getProduct(id: string): Promise<Product> {
    const response = await this.get<{ result: PrintfulProduct }>(`/store/products/${id}`);
    return this.mapProduct(response.result);
  }

  public async getProductVariants(productId: string): Promise<ProductVariant[]> {
    const response = await this.get<{ result: { variants: PrintfulVariant[] } }>(`/store/products/${productId}`);
    return response.result.variants.map(this.mapVariant.bind(this));
  }

  public async createOrder(orderData: Partial<Order>): Promise<Order> {
    const printfulOrder = this.mapOrderToPrintful(orderData);
    const response = await this.post<{ result: any }>('/orders', printfulOrder);
    return this.mapOrderFromPrintful(response.result);
  }

  public async getOrder(id: string): Promise<Order> {
    const response = await this.get<{ result: any }>(`/orders/${id}`);
    return this.mapOrderFromPrintful(response.result);
  }

  public async calculateShipping(address: Address): Promise<ShippingMethod[]> {
    const response = await this.post<{ result: PrintfulShippingRate[] }>(
      '/shipping/rates',
      { address }
    );

    return response.result.map((rate) => ({
      id: `printful_${rate.id}`,
      name: rate.name,
      carrier: 'Printful',
      service: rate.name,
      rate: rate.rate,
      currency: rate.currency,
      estimatedDays: rate.maxDeliveryDays,
      metadata: {
        minDeliveryDays: rate.minDeliveryDays,
        maxDeliveryDays: rate.maxDeliveryDays
      }
    }));
  }

  private mapProduct(data: PrintfulProduct): Product {
    return {
      id: data.id,
      title: data.name,
      description: '',
      price: data.retail_price,
      images: data.files.filter(f => f.type === 'preview').map(f => f.preview_url),
      variants: data.sync_variants.map(this.mapVariant.bind(this)),
      metadata: {
        printfulId: data.id,
        synced: data.synced
      },
      provider: ProviderType.PRINTFUL
    };
  }

  private mapVariant(data: PrintfulVariant | PrintfulSyncVariant): ProductVariant {
    const isSync = 'retail_price' in data;
    return {
      id: data.id,
      sku: isSync ? `pf_${data.variant_id}` : data.sku,
      title: isSync ? `Variant ${data.id}` : data.name,
      price: isSync ? data.retail_price : data.price,
      options: {
        size: (data as PrintfulVariant).size || '',
        color: (data as PrintfulVariant).color || ''
      },
      inStock: isSync ? true : (data as PrintfulVariant).in_stock,
      stockLevel: undefined,
      printAreas: (isSync ? (data as PrintfulSyncVariant).files : []).map(file => ({
        id: file.id,
        name: file.filename,
        width: 0,
        height: 0,
        position: file.position,
        allowedFileTypes: ['png', 'jpg', 'jpeg'],
        dpi: 300
      })),
      metadata: {
        variantId: isSync ? (data as PrintfulSyncVariant).variant_id : (data as PrintfulVariant).variant_id,
        productId: (data as PrintfulVariant).product_id
      }
    };
  }

  private mapOrderToPrintful(order: Partial<Order>): any {
    return {
      external_id: order.externalId,
      shipping: order.shippingMethod?.name,
      recipient: {
        ...order.shippingAddress,
        email: order.shippingAddress?.email || ''
      },
      items: order.items?.map(item => ({
        variant_id: Number(item.variantId),
        quantity: item.quantity,
        files: item.printFiles?.map(file => ({
          url: file.url,
          position: file.position
        }))
      }))
    };
  }

  private mapOrderFromPrintful(data: any): Order {
    return {
      id: data.id.toString(),
      externalId: data.external_id,
      status: this.mapOrderStatus(data.status),
      items: data.items.map((item: any) => ({
        productId: item.sync_variant_id.toString(),
        variantId: item.variant_id.toString(),
        quantity: item.quantity,
        printFiles: item.files?.map((file: any) => ({
          url: file.url,
          position: file.type,
          type: 'image',
          previewUrl: file.preview_url
        }))
      })),
      shippingAddress: data.recipient,
      billingAddress: data.recipient,
      shippingMethod: {
        id: data.shipping.toString(),
        name: data.shipping_service,
        carrier: 'Printful',
        service: data.shipping_service,
        rate: data.costs.shipping,
        currency: 'USD',
        estimatedDays: 14 // Default estimate
      },
      pricing: {
        subtotal: data.costs.subtotal,
        shipping: data.costs.shipping,
        tax: data.costs.tax,
        total: data.costs.total,
        currency: 'USD',
        breakdown: {
          items: data.costs.subtotal,
          shipping: data.costs.shipping,
          tax: data.costs.tax,
          discounts: data.costs.discount || 0
        }
      },
      metadata: {
        printfulId: data.id,
        source: 'printful'
      },
      createdAt: new Date(data.created),
      updatedAt: new Date(data.updated),
      provider: ProviderType.PRINTFUL
    };
  }

  private mapOrderStatus(status: string): OrderStatus {
    const statusMap: Record<string, OrderStatus> = {
      'draft': OrderStatus.DRAFT,
      'pending': OrderStatus.PENDING,
      'inprocess': OrderStatus.PROCESSING,
      'fulfilled': OrderStatus.FULFILLED,
      'shipped': OrderStatus.SHIPPED,
      'completed': OrderStatus.DELIVERED,
      'canceled': OrderStatus.CANCELLED,
      'failed': OrderStatus.FAILED
    };
    return statusMap[status] || OrderStatus.PENDING;
  }
}