// Base model interface
export interface BaseModel {
  id: string;
  created_at: string;
  updated_at: string;
}

// Product types
export type ProductStatus = 'draft' | 'published' | 'archived';

export interface Product extends BaseModel {
  title: string;
  description: string;
  price: number;
  status: ProductStatus;
  metadata: Record<string, unknown>;
  images: string[];
  category_id: string | null;
  store_id: string;
  print_provider_id: string | null;
  stock: number;
  vendor_id: string;
  variants: Record<string, unknown>[];
  shipping_profile_id: string | null;
}

// Store types
export type StoreStatus = 'active' | 'inactive';

export interface Store extends BaseModel {
  name: string;
  domain: string;
  owner_id: string;
  settings: Record<string, unknown>;
  status: StoreStatus;
  metadata: {
    productCount?: number;
    orderCount?: number;
    [key: string]: unknown;
  };
}

// Order types
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  product_id: string;
  variant_id: string;
  quantity: number;
  price: number;
  metadata: Record<string, unknown>;
}

export interface Order extends BaseModel {
  store_id: string;
  customer_id: string | null;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  shipping_address: ShippingAddress;
  billing_address: ShippingAddress;
  metadata: Record<string, unknown>;
  tracking_number?: string;
  provider_order_id?: string;
  notes?: string;
  currency: string;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
}

// Input types for creating/updating
export type ProductInput = Omit<Product, keyof BaseModel>;
export type StoreInput = Omit<Store, keyof BaseModel>;
export type OrderInput = Omit<Order, keyof BaseModel>;

// Re-export common types used in core models
export type { ShippingAddress } from './common';