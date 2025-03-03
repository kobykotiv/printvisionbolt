import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './utils';
import { createTestQueryClient } from './utils';
import type { AppRouter } from '@printvisionbolt/api/src/server/root';
import superjson from 'superjson';

interface WrapperProps {
  children: React.ReactNode;
}

export function createWrapper(mockRouter?: ReturnType<typeof import('./utils').createMockRouter>) {
  function Wrapper({ children }: WrapperProps) {
    const [queryClient] = React.useState(() => createTestQueryClient());
    const [trpcClient] = React.useState(() =>
      trpc.createClient({
        transformer: superjson,
        links: [
          httpBatchLink({
            url: 'http://localhost:3001/api/trpc',
            // Override fetch implementation for tests
            fetch: async (url, options) => {
              const { procedure } = JSON.parse(options?.body as string || '{}');
              const [router, method] = procedure.split('.');
              
              if (!mockRouter || !mockRouter[router]?.[method]) {
                throw new Error(`Mock not found for ${procedure}`);
              }

              const result = await mockRouter[router][method]();
              return {
                ok: true,
                json: async () => ({ result: { data: result } }),
              } as Response;
            },
          }),
        ],
      })
    );

    return (
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </trpc.Provider>
    );
  }

  return Wrapper;
}

export async function createTestWrapper(children: React.ReactNode) {
  const utils = await import('./utils');
  const mockRouter = utils.createMockRouter();
  const Wrapper = createWrapper(mockRouter);
  return <Wrapper>{children}</Wrapper>;
}

// Helper type for inference
export type MockRouter = ReturnType<typeof import('./utils').createMockRouter>;