import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@printvisionbolt/api/src/server/root';
import superjson from 'superjson';

interface ApiClientConfig {
  url: string;
  headers?: Record<string, string>;
}

export function createApiClient({ url, headers = {} }: ApiClientConfig) {
  return createTRPCProxyClient<AppRouter>({
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
  });
}

export type { AppRouter };