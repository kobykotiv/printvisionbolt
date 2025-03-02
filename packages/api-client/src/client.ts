import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../apps/api/src/server/trpc';
import superjson from 'superjson';

export const createApiClient = (baseUrl: string, getToken?: () => string | null) => {
  return createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: `${baseUrl}/trpc`,
        headers: async () => {
          const token = getToken?.();
          return token ? {
            Authorization: `Bearer ${token}`,
          } : {};
        },
      }),
    ],
  });
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
*/