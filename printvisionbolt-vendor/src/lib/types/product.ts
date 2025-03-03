export interface Product {
  id: string;
  shopId: string;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'archived';
  provider: 'printify' | 'printful' | 'gooten';
  providerId: string;
  variants: ProductVariant[];
  printAreas: PrintArea[];
  pricing: {
    basePrice: number;
    currency: string;
  };
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  title: string;
  color: string;
  size: string;
  price: number;
  stock: number;
  metadata: Record<string, unknown>;
}

export interface PrintArea {
  id: string;
  name: string;
  width: number;
  height: number;
  position: {
    x: number;
    y: number;
  };
  constraints: {
    minDpi: number;
    maxDpi: number;
    allowedFormats: string[];
  };
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
  lowStock: number;
  totalRevenue: number;
  averagePrice: number;
  topCategories: Array<{
    category: string;
    count: number;
  }>;
  providerBreakdown: Array<{
    provider: string;
    count: number;
  }>;
}