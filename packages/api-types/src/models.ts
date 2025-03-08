export type BaseModel = {
  id: string;
  created_at: string;
  updated_at: string;
};

export type Product = BaseModel & {
  title: string;
  description: string;
  price: number;
  status: 'draft' | 'published' | 'archived';
  metadata: Record<string, unknown>;
  images: string[];
  category_id: string | null;
  store_id: string;
  print_provider_id: string | null;
  stock: number;
  vendor_id: string;
  variants: Record<string, unknown>[];
  shipping_profile_id: string | null;
};

export type Store = BaseModel & {
  name: string;
  domain: string;
  owner_id: string;
  settings: Record<string, unknown>;
  status: 'active' | 'inactive';
  metadata: Record<string, unknown>;
};

export type Order = BaseModel & {
  store_id: string;
  customer_id: string | null;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: Record<string, unknown>[];
  shipping_address: Record<string, unknown>;
  billing_address: Record<string, unknown>;
  metadata: Record<string, unknown>;
  tracking_number?: string;
  provider_order_id?: string;
  notes?: string;
  currency: string;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
};

export type ProductInput = Omit<Product, keyof BaseModel>;
export type StoreInput = Omit<Store, keyof BaseModel>;
export type OrderInput = Omit<Order, keyof BaseModel>;

// Tiers and Features
export type UserTier = 'free' | 'pro' | 'enterprise';

export type TierLimits = {
  stores: number;
  products: number;
  templates: number;
  storage: number;
};

export type TierFeatures = {
  customDomain: boolean;
  apiAccess: boolean;
  prioritySupport: boolean;
  analytics: boolean;
  bulkOperations: boolean;
};

export type TierConfig = {
  name: UserTier;
  limits: TierLimits;
  features: TierFeatures;
  price: number;
};