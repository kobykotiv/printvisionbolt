// Common types for POD services
export interface Product {
  id: string;
  title: string;
  description?: string;
  price?: number;
  images?: string[];
  variants: ProductVariant[];
  metadata: ProductMetadata;
  provider: ProviderType;
}

export interface ProductVariant {
  id: string;
  sku: string;
  title: string;
  price: number;
  options: Record<string, string>;
  inStock: boolean;
  stockLevel?: number;
  printAreas: PrintArea[];
  metadata: VariantMetadata;
}

export interface PrintArea {
  id: string;
  name: string;
  width: number;
  height: number;
  position: string;
  allowedFileTypes: string[];
  dpi: number;
}

export interface ProductMetadata {
  brandId?: string;
  categoryId?: string;
  tags?: string[];
  materials?: string[];
  dimensions?: {
    width: number;
    height: number;
    depth?: number;
    unit: string;
  };
  weight?: {
    value: number;
    unit: string;
  };
  manufacturingTime?: {
    min: number;
    max: number;
    unit: string;
  };
  printProvider?: string;
  [key: string]: any;
}

export interface VariantMetadata {
  size?: string;
  color?: string;
  style?: string;
  [key: string]: any;
}

export interface Order {
  id: string;
  externalId?: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress?: Address;
  shippingMethod: ShippingMethod;
  pricing: OrderPricing;
  metadata: OrderMetadata;
  createdAt: Date;
  updatedAt: Date;
  provider: ProviderType;
}

export interface OrderItem {
  productId: string;
  variantId: string;
  quantity: number;
  printFiles: PrintFile[];
  metadata?: Record<string, any>;
}

export interface PrintFile {
  url: string;
  position: string;
  type: string;
  previewUrl?: string;
  status?: string;
}

export interface Address {
  name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  country: string;
  zip: string;
  phone?: string;
  email?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  carrier: string;
  service: string;
  rate: number;
  currency: string;
  estimatedDays: number;
  metadata?: Record<string, any>;
}

export interface OrderPricing {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  breakdown: {
    items: number;
    shipping: number;
    tax: number;
    discounts: number;
  } & Record<string, number>;
}

export interface OrderMetadata {
  source?: string;
  customerNotes?: string;
  internalNotes?: string;
  tags?: string[];
  [key: string]: any;
}

export enum OrderStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PROCESSING = 'processing',
  FULFILLED = 'fulfilled',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  FAILED = 'failed'
}

export enum ProviderType {
  PRINTIFY = 'printify',
  PRINTFUL = 'printful',
  GELATO = 'gelato',
  GOOTEN = 'gooten'
}

export interface RateLimit {
  limit: number;
  remaining: number;
  reset: number;
}