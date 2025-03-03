<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> c34d7d5 (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)
=======
>>>>>>> 25869aa (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)
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
<<<<<<< HEAD
<<<<<<< HEAD

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
=======
=======
>>>>>>> dc00547 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
export { createApiClient } from './client';
export type { AppRouter } from './client';
export { ApiProvider, useApi } from './provider';
export {
  useApiClient,
  trpc,
  useProducts,
  useProduct,
  useOrders,
  useOrder,
  useSession,
  useUser,
} from './hooks';
<<<<<<< HEAD
=======
>>>>>>> c34d7d5 (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)

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
<<<<<<< HEAD
=======
=======
>>>>>>> 25869aa (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)

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
<<<<<<< HEAD
>>>>>>> dc00547 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
  Product,
  Store,
  Order,
  ProductInput,
  OrderInput,
  StoreInput,
<<<<<<< HEAD
} from '@printvisionbolt/api-types';
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
=======
=======
>>>>>>> 25869aa (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)
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
<<<<<<< HEAD
}
>>>>>>> c34d7d5 (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)
=======
} from '@printvisionbolt/api-types';
>>>>>>> dc00547 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
=======
}
>>>>>>> 25869aa (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)
