import type { PodProvider } from './pod';

export interface PrintifyArea {
  id: string;
  title: string;
  width: number;
  height: number;
  constraints?: {
    min_dpi?: number;
    max_dpi?: number;
    formats?: string[];
  };
}

export interface PrintfulArea {
  id: string;
  name: string;
  width: number;
  height: number;
  x?: number;
  y?: number;
  rotation?: number;
}

export interface PrintifyBlueprint {
  id: string;
  title: string;
  description?: string;
  variants: Array<{
    id: string;
    title: string;
    sku: string;
    options: Record<string, string>;
    cost: number;
    price: number;
  }>;
  print_areas?: PrintifyArea[];
}

export interface PrintfulBlueprint {
  id: string;
  name: string;
  description?: string;
  variants: Array<{
    id: string;
    name: string;
    sku: string;
    options: Record<string, string>;
    cost: number;
    retail_price: number;
  }>;
  print_details?: {
    placement_areas?: PrintfulArea[];
  };
}

export interface GootenBlueprint {
  id: string;
  name: string;
  description?: string;
  variants: Array<{
    id: string;
    name: string;
    sku: string;
    options: Record<string, string>;
    price: number;
  }>;
  printAreas: Array<{
    id: string;
    name: string;
    width: number;
    height: number;
    x: number;
    y: number;
    rotation: number;
  }>;
}

export interface GelatoBlueprint {
  id: string;
  name: string;
  description?: string;
  variants: Array<{
    id: string;
    name: string;
    sku: string;
    attributes: Record<string, string>;
    basePrice: number;
  }>;
  printAreas: Array<{
    id: string;
    name: string;
    width: number;
    height: number;
    position: {
      x: number;
      y: number;
      rotation: number;
    };
  }>;
}

export type SupplierBlueprint = 
  | { provider: 'printify'; data: PrintifyBlueprint }
  | { provider: 'printful'; data: PrintfulBlueprint }
  | { provider: 'gooten'; data: GootenBlueprint }
  | { provider: 'gelato'; data: GelatoBlueprint };

export interface SupplierEndpoints {
  blueprints: string;
  blueprint: (id: string) => string;
}

export const SUPPLIER_ENDPOINTS: Record<PodProvider, SupplierEndpoints> = {
  printify: {
    blueprints: 'https://api.printify.com/v1/catalog/blueprints.json',
    blueprint: (id) => `https://api.printify.com/v1/catalog/blueprints/${id}.json`
  },
  printful: {
    blueprints: 'https://api.printful.com/products',
    blueprint: (id) => `https://api.printful.com/products/${id}`
  },
  gooten: {
    blueprints: 'https://gtnadminassets.blob.core.windows.net/productdatav3/catalog.json',
    blueprint: (id) => `https://api.gooten.com/v1/products/${id}`
  },
  gelato: {
    blueprints: 'https://product.gelatoapis.com/v3/catalogs',
    blueprint: (id) => `https://product.gelatoapis.com/v3/catalogs/products/${id}`
  }
};