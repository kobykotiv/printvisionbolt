/**
 * Core types for the blueprint system
 */

export interface ProductImage {
  id: string;
  url: string;
  position: number;
  type: 'preview' | 'mockup' | 'template';
  variantId?: string;
}

export interface PrintingOption {
  id: string;
  technique: string;
  locations: string[];
  constraints: PrintingConstraints;
}

export interface PrintingConstraints {
  minDpi: number;
  maxDpi: number;
  width: number;
  height: number;
  allowedColors?: string[];
  maxColors?: number;
  fileTypes: string[];
}

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  attributes: {
    size?: string;
    color?: string;
    material?: string;
    [key: string]: string | undefined;
  };
  stock: number;
  price: PriceInfo;
}

export interface PriceInfo {
  amount: number;
  currency: string;
  productionCost?: number;
  shippingCost?: number;
}

export interface BulkPricingTier {
  minQuantity: number;
  price: PriceInfo;
}

export interface ProductionTimeEstimate {
  min: number;
  max: number;
  unit: 'hours' | 'days' | 'weeks';
}

export interface Blueprint {
  id: string;
  providerId: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  variants: ProductVariant[];
  printingOptions: PrintingOption[];
  images: ProductImage[];
  productionTime: ProductionTimeEstimate;
  pricing: {
    base: PriceInfo;
    bulk?: BulkPricingTier[];
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    tags: string[];
  };
  dimensions?: {
    width: number;
    height: number;
    depth?: number;
    unit: 'in' | 'cm' | 'mm';
    weight?: {
      value: number;
      unit: 'oz' | 'g' | 'kg' | 'lb';
    };
  };
}

export interface BlueprintSearchParams {
  query?: string;
  category?: string;
  providerId?: string;
  priceRange?: {
    min?: number;
    max?: number;
    currency: string;
  };
  tags?: string[];
  printingTechniques?: string[];
  inStock?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface BlueprintSearchResult {
  items: Blueprint[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}