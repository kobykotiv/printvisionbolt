import { useMemo } from 'react';
import { QueryClient } from '@tanstack/react-query';
import type { AppRouter } from '@printvisionbolt/api/src/server/root';
import { createTRPCReact } from '@trpc/react-query';
import superjson from 'superjson';
import { httpBatchLink } from '@trpc/client';

export const trpc = createTRPCReact<AppRouter>();

interface ApiConfig {
  url: string;
  headers?: Record<string, string>;
}

export function useApiClient(config: ApiConfig) {
  const { url, headers = {} } = config;

  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 1000,
        retry: 1,
      },
    },
  }), []);

  const trpcClient = useMemo(
    () =>
      trpc.createClient({
        transformer: superjson,
        links: [
          httpBatchLink({
            url,
            headers: async () => {
              return {
                ...headers,
              };
            },
          }),
        ],
      }),
    [url, headers]
  );

  return {
    trpc,
    trpcClient,
    queryClient,
  };
}

// Type-safe hooks for common operations
export function useProducts(storeId: string) {
  return trpc.product.list.useQuery({ store_id: storeId });
}

export function useProduct(productId: string) {
  return trpc.product.get.useQuery(productId);
}

export function useOrders(storeId: string) {
  return trpc.order.list.useQuery({ store_id: storeId });
}

export function useOrder(orderId: string) {
  return trpc.order.get.useQuery(orderId);
}

export function useSession() {
  return trpc.auth.getSession.useQuery();
}

export function useUser() {
  return trpc.auth.getUser.useQuery();
}