import type { 
  Product,
  Store,
  Order,
  ProductInput,
  OrderInput,
  StoreInput,
} from '@printvision/api-types';

// Provider implementations
export { BaseProvider } from './base-provider';
export { PrintifyProvider } from './providers/printify';
export { PrintfulProvider } from './providers/printful';
export { GootenProvider } from './providers/gooten';
export { GelatoProvider } from './providers/gelato';

// API Client exports
export { createApiClient } from './client';
export { ApiProvider, useApi } from './provider';

// Hooks
export { 
  useApiClient,
  useProducts,
  useProduct,
  useOrders,
  useOrder,
  useStores,
  useStore,
  useSession,
  useUser,
} from './hooks';

// Types
export type { AppRouter } from './client';

// Re-export types from api-types
export type {
  Product,
  Store,
  Order,
  ProductInput,
  OrderInput,
  StoreInput,
};
