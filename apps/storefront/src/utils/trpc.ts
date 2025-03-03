import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@printvisionbolt/api';
import superjson from 'superjson';
import { httpBatchLink } from '@trpc/client';

const trpcOptions = {
  unstable_overrides: {
    useMutation: {
      async onSuccess(opts: any) {
        await opts.originalFn();
        await opts.queryClient.invalidateQueries();
      },
    },
  },
};

export const trpc = createTRPCReact<AppRouter>(trpcOptions);

// Create TRPCClient with superjson transformer
export const createTrpcClient = () => {
  return trpc.createClient({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/trpc',
        headers() {
          return {
            'x-tenant-id': 'storefront',
          };
        },
      }),
    ],
  });
};

// Export type helpers
export type RouterInputs = {
  [TRouter in keyof AppRouter]: {
    [TProcedure in keyof AppRouter[TRouter]]: AppRouter[TRouter][TProcedure] extends {
      _input: infer TInput;
    }
      ? TInput
      : never;
  };
};

export type RouterOutputs = {
  [TRouter in keyof AppRouter]: {
    [TProcedure in keyof AppRouter[TRouter]]: AppRouter[TRouter][TProcedure] extends {
      _output: infer TOutput;
    }
      ? TOutput
      : never;
  };
};