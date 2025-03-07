import { ShippingAddress, ApiResponse } from './common';

// Re-export types from all modules
export * from './core';
export * from './common';
export * from './settings';
export * from './subscription';

// Provider-specific types
export type ProviderType = 'printful' | 'printify' | 'gooten' | 'gelato';

// Product-related types
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
  errors: Array<{
    productId: string;
    error: string;
  }>;
  metadata: {
    totalProcessed: number;
    lastSyncedAt: string;
  };
}

// Provider integration types
export interface ProductData {
  title: string;
  description?: string;
  variants: Array<{
    title: string;
    price: number;
    sku: string;
    options?: Record<string, string>;
  }>;
  images: string[];
}

export interface ProviderProduct {
  id: string;
  title: string;
  description?: string;
  variants: Array<{
    id: string;
    sku: string;
    title: string;
    price: number;
    quantity: number;
    metadata: Record<string, unknown>;
  }>;
  images: string[];
  metadata: Record<string, unknown>;
  externalId: string;
  providerType: ProviderType;
}

export interface InventoryData {
  productId: string;
  variants: Array<{
    sku: string;
    quantity: number;
  }>;
}

export interface OrderCreateData {
  externalId: string;
  items: Array<{
    productId: string;
    variantSku: string;
    quantity: number;
  }>;
  shippingAddress: ShippingAddress;
  shippingMethod: string;
}

export interface ShippingRate {
  id: string;
  name: string;
  price: number;
  currency: string;
  estimatedDays: number;
}

// Response types
export type ListResponse<T> = ApiResponse<T[]>;
export type DetailResponse<T> = ApiResponse<T>;
export type CreateResponse = ApiResponse<{ id: string }>;
export type UpdateResponse = ApiResponse<{ success: boolean }>;
export type DeleteResponse = ApiResponse<{ success: boolean }>;

// Utility types
export type Modify<T, R> = Omit<T, keyof R> & R;
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : T[P] extends Record<string, unknown>
    ? DeepPartial<T[P]>
    : T[P];
};
