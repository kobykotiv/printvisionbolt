import { createTRPCReact } from '@trpc/react-query';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
import { type AppRouter } from '@printvisionbolt/api';
=======
import type { AppRouter } from '@printvisionbolt/api';
import superjson from 'superjson';
import { httpBatchLink } from '@trpc/client';
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)

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

<<<<<<< HEAD
=======
import { type AppRouter } from '@printvisionbolt/api';
=======
import type { AppRouter } from '@printvisionbolt/api';
import superjson from 'superjson';
import { httpBatchLink } from '@trpc/client';
>>>>>>> dc00547 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)

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

<<<<<<< HEAD
>>>>>>> 318c476 (chore: Stage changes for turborepo migration)
export type RouterOutput = {
  [K in keyof AppRouter['_def']['record']]: {
    [P in keyof AppRouter['_def']['record'][K]]: ReturnType<
      AppRouter['_def']['record'][K][P]
    >;
<<<<<<< HEAD
>>>>>>> 3bc1751 (chore: Stage changes for turborepo migration)
=======
=======
>>>>>>> dc00547 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
export type RouterOutputs = {
  [TRouter in keyof AppRouter]: {
    [TProcedure in keyof AppRouter[TRouter]]: AppRouter[TRouter][TProcedure] extends {
      _output: infer TOutput;
    }
      ? TOutput
      : never;
<<<<<<< HEAD
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
=======
>>>>>>> 318c476 (chore: Stage changes for turborepo migration)
=======
>>>>>>> dc00547 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
  };
};