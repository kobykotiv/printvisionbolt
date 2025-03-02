<<<<<<< HEAD
<<<<<<< HEAD
export type ProductStatus = 'draft' | 'published' | 'archived';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category?: string;
  status: ProductStatus;
  stock: number;
  metadata?: Record<string, unknown>;
  vendor_id: string;
  created_at: string;
  updated_at: string;
=======
=======
export type ProductStatus = 'draft' | 'published' | 'archived';

>>>>>>> b38644b (feat: Enhance product management with Stripe integration and update product attributes)
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
<<<<<<< HEAD
  category: string;
  inStock: boolean;
  featuredImage?: string;
  variants?: ProductVariant[];
>>>>>>> 3bc1751 (chore: Stage changes for turborepo migration)
=======
  category?: string;
  status: ProductStatus;
  stock: number;
  metadata?: Record<string, unknown>;
  vendor_id: string;
  created_at: string;
  updated_at: string;
>>>>>>> b38644b (feat: Enhance product management with Stripe integration and update product attributes)
}

export interface ProductVariant {
  id: string;
<<<<<<< HEAD
<<<<<<< HEAD
  title: string;
  price: number;
  stock: number;
=======
  name: string;
  price: number;
  inStock: boolean;
>>>>>>> 3bc1751 (chore: Stage changes for turborepo migration)
=======
  title: string;
  price: number;
  stock: number;
>>>>>>> b38644b (feat: Enhance product management with Stripe integration and update product attributes)
}

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  imageUrl?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  total: number;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  variantId?: string;
}

export interface Address {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}
