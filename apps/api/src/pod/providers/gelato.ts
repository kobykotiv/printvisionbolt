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

interface GelatoProduct {
  id: string;
  name: string;
  description?: string;
  productGroups: string[];
  productTypes: string[];
  merchantSku?: string;
  variants: GelatoVariant[];
  assets?: GelatoAsset[];
}

interface GelatoVariant {
  id: string;
  sku: string;
  productId: string;
  name: string;
  description?: string;
  attributes: {
    size?: string;
    color?: string;
    [key: string]: any;
  };
  prices: {
    amount: number;
    currency: string;
  }[];
  availability: {
    isAvailable: boolean;
    stockLevel?: number;
  };
  printAreas: GelatoPrintArea[];
}

interface GelatoPrintArea {
  id: string;
  name: string;
  dimensions: {
    width: number;
    height: number;
    unit: string;
  };
  position: string;
  supportedFileTypes: string[];
  printQuality: {
    dpi: number;
    [key: string]: any;
  };
}

interface GelatoAsset {
  id: string;
  type: string;
  url: string;
  usage: string;
  metadata?: Record<string, any>;
}

interface GelatoShippingRate {
  id: string;
  method: string;
  carrier: string;
  price: {
    amount: number;
    currency: string;
  };
  estimatedDays: {
    min: number;
    max: number;
  };
}

export class GelatoApiClient extends PodBaseClient {
  constructor(apiKey: string) {
    super(apiKey, 'https://api.gelato.com/v1');
  }

  public async getProducts(): Promise<Product[]> {
    const response = await this.get<{ items: GelatoProduct[] }>('/products');
    return response.items.map(this.mapProduct.bind(this));
  }

  public async getProduct(id: string): Promise<Product> {
    const response = await this.get<GelatoProduct>(`/products/${id}`);
    return this.mapProduct(response);
  }

  public async getProductVariants(productId: string): Promise<ProductVariant[]> {
    const response = await this.get<{ items: GelatoVariant[] }>(`/products/${productId}/variants`);
    return response.items.map(this.mapVariant.bind(this));
  }

  public async createOrder(orderData: Partial<Order>): Promise<Order> {
    const gelatoOrder = this.mapOrderToGelato(orderData);
    const response = await this.post<any>('/orders', gelatoOrder);
    return this.mapOrderFromGelato(response);
  }

  public async getOrder(id: string): Promise<Order> {
    const response = await this.get<any>(`/orders/${id}`);
    return this.mapOrderFromGelato(response);
  }

  public async calculateShipping(address: Address): Promise<ShippingMethod[]> {
    const response = await this.post<{ rates: GelatoShippingRate[] }>(
      '/shipping/rates',
      { address }
    );

    return response.rates.map(rate => ({
      id: `gelato_${rate.id}`,
      name: rate.method,
      carrier: rate.carrier,
      service: rate.method,
      rate: rate.price.amount,
      currency: rate.price.currency,
      estimatedDays: rate.estimatedDays.max,
      metadata: {
        minDays: rate.estimatedDays.min,
        maxDays: rate.estimatedDays.max
      }
    }));
  }

  private mapProduct(data: GelatoProduct): Product {
    return {
      id: data.id,
      title: data.name,
      description: data.description,
      images: data.assets?.filter(a => a.type === 'image').map(a => a.url) || [],
      variants: data.variants.map(this.mapVariant.bind(this)),
      metadata: {
        merchantSku: data.merchantSku,
        productGroups: data.productGroups,
        productTypes: data.productTypes
      },
      provider: ProviderType.GELATO
    };
  }

  private mapVariant(data: GelatoVariant): ProductVariant {
    const price = data.prices.find(p => p.currency === 'USD')?.amount || 0;
    
    return {
      id: data.id,
      sku: data.sku,
      title: data.name,
      price,
      options: data.attributes,
      inStock: data.availability.isAvailable,
      stockLevel: data.availability.stockLevel,
      printAreas: data.printAreas.map(area => ({
        id: area.id,
        name: area.name,
        width: area.dimensions.width,
        height: area.dimensions.height,
        position: area.position,
        allowedFileTypes: area.supportedFileTypes,
        dpi: area.printQuality.dpi
      })),
      metadata: {
        productId: data.productId,
        description: data.description
      }
    };
  }

  private mapOrderToGelato(order: Partial<Order>): any {
    return {
      externalId: order.externalId,
      shippingAddress: this.mapAddressToGelato(order.shippingAddress!),
      items: order.items?.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
        printFiles: item.printFiles?.map(file => ({
          url: file.url,
          position: file.position
        }))
      })),
      shippingMethod: order.shippingMethod?.service
    };
  }

  private mapAddressToGelato(address: Address): any {
    return {
      name: address.name,
      company: address.company,
      addressLine1: address.address1,
      addressLine2: address.address2,
      city: address.city,
      state: address.state,
      country: address.country,
      postcode: address.zip,
      phone: address.phone,
      email: address.email
    };
  }

  private mapOrderFromGelato(data: any): Order {
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
          position: file.position,
          type: file.type,
          status: file.status
        }))
      })),
      shippingAddress: this.mapAddressFromGelato(data.shippingAddress),
      billingAddress: this.mapAddressFromGelato(data.billingAddress),
      shippingMethod: {
        id: data.shipping.id,
        name: data.shipping.method,
        carrier: data.shipping.carrier,
        service: data.shipping.method,
        rate: data.shipping.price.amount,
        currency: data.shipping.price.currency,
        estimatedDays: data.shipping.estimatedDays.max
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
        gelatoId: data.id,
        source: 'gelato'
      },
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      provider: ProviderType.GELATO
    };
  }

  private mapAddressFromGelato(data: any): Address {
    return {
      name: data.name,
      company: data.company,
      address1: data.addressLine1,
      address2: data.addressLine2,
      city: data.city,
      state: data.state,
      country: data.country,
      zip: data.postcode,
      phone: data.phone,
      email: data.email
    };
  }

  private mapOrderStatus(status: string): OrderStatus {
    const statusMap: Record<string, OrderStatus> = {
      'draft': OrderStatus.DRAFT,
      'pending': OrderStatus.PENDING,
      'in_production': OrderStatus.PROCESSING,
      'produced': OrderStatus.FULFILLED,
      'shipped': OrderStatus.SHIPPED,
      'delivered': OrderStatus.DELIVERED,
      'cancelled': OrderStatus.CANCELLED,
      'failed': OrderStatus.FAILED
    };
    return statusMap[status] || OrderStatus.PENDING;
  }
}