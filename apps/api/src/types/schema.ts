export interface User {
  id: string;
  email: string;
  created_at: string;
  role: 'user' | 'vendor' | 'admin';
  metadata?: Record<string, any>;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  vendor_id: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published' | 'archived';
  metadata?: Record<string, any>;
  images: string[];
  stock: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
  total: number;
  shipping_address: Address;
  billing_address: Address;
  items: OrderItem[];
  metadata?: Record<string, any>;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  metadata?: Record<string, any>;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id?: string;
  metadata?: Record<string, any>;
}

export interface Settings {
  vendor_id: string;
  store_name: string;
  theme: {
    primary_color: string;
    accent_color: string;
    glass_effect: 'basic' | 'advanced' | 'custom';
  };
  features: {
    multilanguage: boolean;
    analytics: 'basic' | 'enhanced' | 'advanced' | 'custom';
    custom_domain: boolean;
  };
  limits: {
    products: number;
    storage: number;
  };
}