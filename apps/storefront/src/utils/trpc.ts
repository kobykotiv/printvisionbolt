import { createTRPCReact } from '@trpc/react-query';
import { type AppRouter } from '@printvisionbolt/api';

export const trpc = createTRPCReact<AppRouter>();

// Export type helpers
export type RouterInput = {
  [K in keyof AppRouter['_def']['record']]: {
    [P in keyof AppRouter['_def']['record'][K]]: Parameters<
      AppRouter['_def']['record'][K][P]
    >[0];
  };
};

export type RouterOutput = {
  [K in keyof AppRouter['_def']['record']]: {
    [P in keyof AppRouter['_def']['record'][K]]: ReturnType<
      AppRouter['_def']['record'][K][P]
    >;
  };
};