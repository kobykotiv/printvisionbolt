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

interface GootenProduct {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  images: GootenImage[];
  variants: GootenVariant[];
  templateId: string;
  categoryId: string;
  productType: string;
}

interface GootenImage {
  url: string;
  type: string;
  index: number;
}

interface GootenVariant {
  id: string;
  sku: string;
  name: string;
  price: {
    amount: number;
    currency: string;
  };
  options: {
    size?: string;
    color?: string;
    [key: string]: any;
  };
  stock: {
    available: boolean;
    quantity?: number;
  };
  printableAreas: GootenPrintArea[];
}

interface GootenPrintArea {
  id: string;
  name: string;
  width: number;
  height: number;
  location: string;
  fileSpecs: {
    fileTypes: string[];
    dpi: number;
    dimensions: {
      width: number;
      height: number;
      unit: string;
    };
  };
}

interface GootenShippingOption {
  id: string;
  name: string;
  carrierId: string;
  carrierName: string;
  price: {
    amount: number;
    currency: string;
  };
  deliveryDays: {
    min: number;
    max: number;
  };
}

export class GootenApiClient extends PodBaseClient {
  constructor(apiKey: string) {
    super(apiKey, 'https://api.gooten.com/v1');
  }

  public async getProducts(): Promise<Product[]> {
    const response = await this.get<{ items: GootenProduct[] }>('/products');
    return response.items.map(this.mapProduct.bind(this));
  }

  public async getProduct(id: string): Promise<Product> {
    const response = await this.get<GootenProduct>(`/products/${id}`);
    return this.mapProduct(response);
  }

  public async getProductVariants(productId: string): Promise<ProductVariant[]> {
    const response = await this.get<{ variants: GootenVariant[] }>(`/products/${productId}/variants`);
    return response.variants.map(this.mapVariant.bind(this));
  }

  public async createOrder(orderData: Partial<Order>): Promise<Order> {
    const gootenOrder = this.mapOrderToGooten(orderData);
    const response = await this.post<any>('/orders', gootenOrder);
    return this.mapOrderFromGooten(response);
  }

  public async getOrder(id: string): Promise<Order> {
    const response = await this.get<any>(`/orders/${id}`);
    return this.mapOrderFromGooten(response);
  }

  public async calculateShipping(address: Address): Promise<ShippingMethod[]> {
    const response = await this.post<{ options: GootenShippingOption[] }>(
      '/shipping/calculate',
      { address }
    );

    return response.options.map(option => ({
      id: `gooten_${option.id}`,
      name: option.name,
      carrier: option.carrierName,
      service: option.name,
      rate: option.price.amount,
      currency: option.price.currency,
      estimatedDays: option.deliveryDays.max,
      metadata: {
        carrierId: option.carrierId,
        minDays: option.deliveryDays.min,
        maxDays: option.deliveryDays.max
      }
    }));
  }

  private mapProduct(data: GootenProduct): Product {
    return {
      id: data.id,
      title: data.name,
      description: data.description,
      images: data.images
        .sort((a, b) => a.index - b.index)
        .map(img => img.url),
      variants: data.variants.map(this.mapVariant.bind(this)),
      metadata: {
        templateId: data.templateId,
        categoryId: data.categoryId,
        productType: data.productType,
        shortDescription: data.shortDescription
      },
      provider: ProviderType.GOOTEN
    };
  }

  private mapVariant(data: GootenVariant): ProductVariant {
    return {
      id: data.id,
      sku: data.sku,
      title: data.name,
      price: data.price.amount,
      options: data.options,
      inStock: data.stock.available,
      stockLevel: data.stock.quantity,
      printAreas: data.printableAreas.map(area => ({
        id: area.id,
        name: area.name,
        width: area.width,
        height: area.height,
        position: area.location,
        allowedFileTypes: area.fileSpecs.fileTypes,
        dpi: area.fileSpecs.dpi
      })),
      metadata: {
        dimensions: data.printableAreas[0]?.fileSpecs.dimensions
      }
    };
  }

  private mapOrderToGooten(order: Partial<Order>): any {
    return {
      externalId: order.externalId,
      shippingMethod: {
        id: order.shippingMethod?.id.replace('gooten_', ''),
        name: order.shippingMethod?.name
      },
      shippingAddress: this.mapAddressToGooten(order.shippingAddress!),
      items: order.items?.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
        files: item.printFiles?.map(file => ({
          url: file.url,
          location: file.position
        }))
      }))
    };
  }

  private mapAddressToGooten(address: Address): any {
    return {
      name: address.name,
      companyName: address.company,
      line1: address.address1,
      line2: address.address2,
      city: address.city,
      state: address.state,
      countryCode: address.country,
      postalCode: address.zip,
      phone: address.phone,
      email: address.email
    };
  }

  private mapOrderFromGooten(data: any): Order {
    return {
      id: data.id,
      externalId: data.externalId,
      status: this.mapOrderStatus(data.status),
      items: data.items.map((item: any) => ({
        productId: item.product.id,
        variantId: item.variant.id,
        quantity: item.quantity,
        printFiles: item.files?.map((file: any) => ({
          url: file.url,
          position: file.location,
          type: 'image',
          status: file.status
        }))
      })),
      shippingAddress: this.mapAddressFromGooten(data.shippingAddress),
      billingAddress: this.mapAddressFromGooten(data.billingAddress),
      shippingMethod: {
        id: `gooten_${data.shipping.id}`,
        name: data.shipping.name,
        carrier: data.shipping.carrier,
        service: data.shipping.service,
        rate: data.pricing.shipping,
        currency: data.pricing.currency,
        estimatedDays: data.shipping.estimatedDays
      },
      pricing: {
        subtotal: data.pricing.subtotal,
        shipping: data.pricing.shipping,
        tax: data.pricing.tax,
        total: data.pricing.total,
        currency: data.pricing.currency,
        breakdown: {
          items: data.pricing.subtotal,
          shipping: data.pricing.shipping,
          tax: data.pricing.tax,
          discounts: data.pricing.discounts || 0
        }
      },
      metadata: {
        gootenId: data.id,
        source: 'gooten'
      },
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      provider: ProviderType.GOOTEN
    };
  }

  private mapAddressFromGooten(data: any): Address {
    return {
      name: data.name,
      company: data.companyName,
      address1: data.line1,
      address2: data.line2,
      city: data.city,
      state: data.state,
      country: data.countryCode,
      zip: data.postalCode,
      phone: data.phone,
      email: data.email
    };
  }

  private mapOrderStatus(status: string): OrderStatus {
    const statusMap: Record<string, OrderStatus> = {
      'draft': OrderStatus.DRAFT,
      'pending': OrderStatus.PENDING,
      'processing': OrderStatus.PROCESSING,
      'manufactured': OrderStatus.FULFILLED,
      'shipped': OrderStatus.SHIPPED,
      'delivered': OrderStatus.DELIVERED,
      'cancelled': OrderStatus.CANCELLED,
      'failed': OrderStatus.FAILED
    };
    return statusMap[status] || OrderStatus.PENDING;
  }
}