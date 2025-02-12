export type PrintProvider = 'printify' | 'printful' | 'gooten' | 'gelato' | 'prodigi';

export interface Blueprint {
  id: string;
  title: string;
  description?: string;
  provider: PrintProvider;
  providerId: string;
  variants: ProductVariant[];
  placeholders: Placeholder[];
  pricing: {
    baseCost: number;
    retailPrice: number;
  };
}

export interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  options: Record<string, string>;
  pricing?: {
    baseCost?: number;
    retailPrice?: number;
  };
}

export interface Placeholder {
  id: string;
  name: string;
  width: number;
  height: number;
  x: number;
  y: number;
  rotation: number;
  required: boolean;
  constraints: {
    minDpi: number;
    maxDpi: number;
    allowedFormats: string[];
  };
}

export interface Template {
  id: string;
  title: string;
  description?: string;
  blueprints: Blueprint[];
  tags: string[];
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface TemplateWithStats extends Template {
  productCount: number;
  designCount: number;
  lastSync?: {
    date: string;
    status: 'success' | 'error';
  };
}
