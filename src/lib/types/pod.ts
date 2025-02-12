// Provider Types
export type PodProvider = 'printify' | 'printful' | 'gooten' | 'gelato';
export type Environment = 'production' | 'sandbox';

// Store & Connection Types
export interface Store {
  id: string;
  name: string;
  provider: PodProvider;
  credentials?: {
    apiKey?: string;
    refreshToken?: string;
    expiresAt?: string;
  };
  settings?: Record<string, unknown>;
}

export interface PodConnection {
  id: string;
  provider: PodProvider;
  apiKey: string;
  storeId?: string;
  environment: Environment;
  isActive: boolean;
  lastSyncedAt?: string;
  status: 'connected' | 'disconnected' | 'error';
  error?: string;
}

// Configuration & Settings Types
export interface SyncSettings {
  autoSync: boolean;
  syncInterval: number; // in minutes
  syncProducts: boolean;
  syncInventory: boolean;
  syncPricing: boolean;
  notifyOnError: boolean;
}

export interface PodIntegrationConfig {
  connection: PodConnection;
  syncSettings: SyncSettings;
}

// Product Types
export interface PodProduct {
  id: string;
  provider: PodProvider;
  externalId: string;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'archived';
  variants: PodVariant[];
  images: PodImage[];
  pricing: {
    baseCost: number;
    retailPrice: number;
    currency: string;
  };
  shipping?: {
    weight: number;
    length: number;
    width: number;
    height: number;
  };
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface PodVariant {
  id: string;
  sku: string;
  title: string;
  options: Record<string, string>;
  pricing?: {
    baseCost: number;
    retailPrice: number;
  };
  stock?: number;
  metadata?: Record<string, unknown>;
}

export interface PodImage {
  id: string;
  url: string;
  position: number;
  variantIds?: string[];
  width: number;
  height: number;
  type: string;
}

// Sync & Service Types
export interface PodSyncResult {
  success: boolean;
  error?: string;
  itemsProcessed: number;
  itemsFailed: number;
  details?: {
    addedProducts: number;
    updatedProducts: number;
    deletedProducts: number;
    skippedProducts: number;
  };
  duration: number;  // in milliseconds
}

export interface PodService {
  connect(config: PodConnection): Promise<void>;
  disconnect(providerId: string): Promise<void>;
  syncProducts(providerId: string): Promise<PodSyncResult>;
  getProducts(providerId: string): Promise<PodProduct[]>;
  createProduct(providerId: string, product: Partial<PodProduct>): Promise<PodProduct>;
  updateProduct(providerId: string, productId: string, updates: Partial<PodProduct>): Promise<PodProduct>;
  deleteProduct(providerId: string, productId: string): Promise<void>;
  getStores(providerId: string): Promise<Store[]>;
}

// Provider-specific Types
export interface PrintifyConfig extends PodIntegrationConfig {
  shopId?: string;
  publishAutomatically?: boolean;
}

export interface PrintfulConfig extends PodIntegrationConfig {
  warehouseId?: string;
  taxStrategy?: 'auto' | 'manual';
}

export interface GootenConfig extends PodIntegrationConfig {
  recipientId?: string;
  shippingZones?: string[];
}

export interface GelatoConfig extends PodIntegrationConfig {
  fulfillmentRegion?: string;
  packingSlipTemplate?: string;
}
