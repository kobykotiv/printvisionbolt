export type ProviderType = 'printify' | 'printful' | 'gooten' | 'gelato';

export interface ProviderCredentials {
  apiKey: string;
  providerId: ProviderType;
  webhookSecret?: string;
}

export interface ProductData {
  externalId?: string;
  title: string;
  description?: string;
  variants: ProductVariant[];
  images: string[];
}

export interface ProductVariant {
  sku?: string;
  title: string;
  price: number;
  options: Record<string, string>;
}

export interface InventoryData {
  productId: string;
  variants: {
    sku: string;
    quantity: number;
  }[];
}

export interface ShippingAddress {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

export interface ShippingRate {
  id: string;
  name: string;
  price: number;
  currency: string;
  estimatedDays: number;
}

export interface OrderData {
  externalId?: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: string;
}

export interface OrderItem {
  productId: string;
  variantSku: string;
  quantity: number;
}

export interface WebhookPayload {
  type: 'orderStatus' | 'inventory' | 'shipping';
  providerId: ProviderType;
  data: Record<string, any>;
}

export interface ProviderProduct {
  id: string;
  title: string;
  description?: string;
  variants: ProviderVariant[];
  images: string[];
  metadata: Record<string, any>;
  externalId: string;
  providerType: ProviderType;
}

export interface ProviderVariant {
  id: string;
  sku: string;
  title: string;
  price: number;
  quantity: number;
  metadata: Record<string, any>;
}

export interface ProductList {
  items: ProviderProduct[];
  totalCount: number;
  hasMore: boolean;
  cursor?: string;
}

export interface SyncResult {
  added: ProviderProduct[];
  updated: ProviderProduct[];
  removed: string[];
  errors: {
    productId: string;
    error: string;
  }[];
  metadata: {
    totalProcessed: number;
    lastSyncedAt: string;
  };
}

export interface PaginationOptions {
  limit?: number;
  cursor?: string;
}

export interface PrintProvider {
  type: ProviderType;
  initialize(credentials: ProviderCredentials): Promise<void>;
  createProduct(data: ProductData): Promise<string>;
  syncInventory(productId: string): Promise<InventoryData>;
  createOrder(orderData: OrderData): Promise<string>;
  getShippingRates(address: ShippingAddress): Promise<ShippingRate[]>;

  // New methods for MVP
  getProducts(options?: PaginationOptions): Promise<ProductList>;
  syncProducts(): Promise<SyncResult>;
}