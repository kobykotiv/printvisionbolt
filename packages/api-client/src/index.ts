import type { 
  ProductData, 
  InventoryData, 
  OrderData, 
  ShippingAddress, 
  ShippingRate,
  ProviderType,
  ProviderCredentials,
  ProductList,
  SyncResult,
  PaginationOptions,
  ProviderProduct
} from '../../api-types/src';

import { BaseProvider } from './base-provider';
import { PrintifyProvider } from './providers/printify';
import { PrintfulProvider } from './providers/printful';
import { GootenProvider } from './providers/gooten';
import { GelatoProvider } from './providers/gelato';

// Export provider implementations
export {
  BaseProvider,
  PrintifyProvider,
  PrintfulProvider,
  GootenProvider,
  GelatoProvider
};

// Re-export types
export type {
  ProductData,
  InventoryData,
  OrderData,
  ShippingAddress,
  ShippingRate,
  ProviderType,
  ProviderCredentials,
  ProductList,
  SyncResult,
  PaginationOptions,
  ProviderProduct
};

// Factory function for creating provider instances
export function createProvider(type: ProviderType, credentials: ProviderCredentials) {
  switch (type) {
    case 'printify':
      return new PrintifyProvider(credentials);
    case 'printful':
      return new PrintfulProvider(credentials);
    case 'gooten':
      return new GootenProvider(credentials);
    case 'gelato':
      return new GelatoProvider(credentials);
    default:
      throw new Error(`Unsupported provider type: ${type}`);
  }
}