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

// Re-export common types from api-types
export type {
  Product,
  Store,
  Order,
  ProductInput,
  OrderInput,
  StoreInput,
} from '@printvisionbolt/api-types';