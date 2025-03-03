export interface Template {
  id: string;
  name: string;
  description?: string;
  blueprint: Blueprint;
  variants: TemplateVariant[];
  mockupUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateVariant {
  id: string;
  color: string;
  size: string;
  price: number;
  cost: number;
  sku: string;
}

export interface Blueprint {
  id: string;
  name: string;
  supplier: 'printify' | 'printful' | 'gooten';
  category: string;
  productType: string;
  printAreas: PrintArea[];
}

export interface PrintArea {
  name: string;
  width: number;
  height: number;
  position: 'front' | 'back' | 'sleeve' | 'custom';
}

export interface SyncTask {
  id: string;
  type: 'create' | 'update' | 'delete';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  entity: 'product' | 'collection' | 'template';
  entityId: string;
  stores: string[];
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Store {
  id: string;
  name: string;
  platform: 'shopify' | 'etsy' | 'woocommerce';
  connected: boolean;
  settings: StoreSettings;
}

export interface StoreSettings {
  autoSync: boolean;
  markupPercentage: number;
  defaultCollectionId?: string;
  autoPublish: boolean;
}
