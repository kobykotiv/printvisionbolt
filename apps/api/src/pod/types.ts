export interface Provider {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSynced: string | null;
  products: number;
  logo: string;
}

export interface Product {
  id: string;
  name: string;
  provider: string;
  variants: Variant[];
  placeholders: Placeholder[];
}

export interface Variant {
  id: string;
  name: string;
  sku: string;
  price: number;
  image: string;
}

export interface Placeholder {
  id: string | 'design_' | 'logo_' | 'graphic_';
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface Template {
  id: string;
  name: string;
  products: Product[];
}