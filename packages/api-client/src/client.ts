import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import type { AppRouter } from '@printvisionbolt/api/src/server/root';
import superjson from 'superjson';

interface ApiClientConfig {
  url: string;
  headers?: Record<string, string>;
}

export function createApiClient({ url, headers = {} }: ApiClientConfig) {
=======
=======
>>>>>>> 318c476 (chore: Stage changes for turborepo migration)
import type { AppRouter } from '../../../apps/api/src/server/trpc';
import superjson from 'superjson';

export const createApiClient = (baseUrl: string, getToken?: () => string | null) => {
<<<<<<< HEAD
>>>>>>> 3bc1751 (chore: Stage changes for turborepo migration)
=======
import type { AppRouter } from '@printvisionbolt/api/src/server/root';
import superjson from 'superjson';

interface ApiClientConfig {
  url: string;
  headers?: Record<string, string>;
}

export function createApiClient({ url, headers = {} }: ApiClientConfig) {
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
=======
>>>>>>> 318c476 (chore: Stage changes for turborepo migration)
  return createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [
      httpBatchLink({
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        url,
        headers: async () => {
          return {
            ...headers,
          };
=======
=======
>>>>>>> 318c476 (chore: Stage changes for turborepo migration)
        url: `${baseUrl}/trpc`,
        headers: async () => {
          const token = getToken?.();
          return token ? {
            Authorization: `Bearer ${token}`,
          } : {};
<<<<<<< HEAD
>>>>>>> 3bc1751 (chore: Stage changes for turborepo migration)
=======
        url,
        headers: async () => {
          return {
            ...headers,
          };
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
=======
>>>>>>> 318c476 (chore: Stage changes for turborepo migration)
        },
      }),
    ],
  });
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
}

export type { AppRouter };
=======
=======
>>>>>>> 318c476 (chore: Stage changes for turborepo migration)
};

// Hook for managing auth state and tokens
export const useAuth = () => {
  const storage = typeof window !== 'undefined' ? window.localStorage : null;
  
  const getToken = () => storage?.getItem('auth_token') || null;
  
  const setToken = (token: string) => {
    storage?.setItem('auth_token', token);
  };
  
  const clearToken = () => {
    storage?.removeItem('auth_token');
  };

  return {
    getToken,
    setToken,
    clearToken,
  };
};

// Example usage:
/*
import { createApiClient, useAuth } from '@your-org/api-client';

// In your app initialization
const auth = useAuth();
const api = createApiClient('http://localhost:3001', auth.getToken);

// Using the API
try {
  // Public procedures
  const products = await api.products.list.query({ limit: 10 });
  
  // Login
  const { session } = await api.auth.login.mutate({
    email: 'user@example.com',
    password: 'password123'
  });
  auth.setToken(session.access_token);
  
  // Protected procedures (requires auth token)
  const order = await api.orders.create.mutate({
    items: [{
      product_id: '123',
      quantity: 1,
      price: 29.99
    }],
    shipping_address: {
      line1: '123 Main St',
      city: 'Anytown',
      state: 'ST',
      postal_code: '12345',
      country: 'US'
    },
    billing_address: {
      line1: '123 Main St',
      city: 'Anytown',
      state: 'ST',
      postal_code: '12345',
      country: 'US'
    }
  });
} catch (error) {
  console.error('API Error:', error);
}
<<<<<<< HEAD
*/
>>>>>>> 3bc1751 (chore: Stage changes for turborepo migration)
=======
}

export type { AppRouter };
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
=======
*/
>>>>>>> 318c476 (chore: Stage changes for turborepo migration)
