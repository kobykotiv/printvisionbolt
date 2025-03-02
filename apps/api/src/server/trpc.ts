import { initTRPC, TRPCError } from '@trpc/server';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import type { Context } from './context';

export const t = initTRPC.context<Context>().create({
<<<<<<< HEAD
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof Error
            ? error.cause.message
            : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Not authenticated',
=======
import { Context } from './context';
import { ZodError } from 'zod';
import { productRouter } from './routers/product';
import { orderRouter } from './routers/order';
import { authRouter } from './routers/auth';
=======
import type { Context } from './context';
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)

const t = initTRPC.context<Context>().create({
=======
>>>>>>> c34d7d5 (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof Error
            ? error.cause.message
            : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
<<<<<<< HEAD
      message: 'You must be logged in to access this resource',
>>>>>>> 1100452 (feat: add dashboard and product pages, integrate shared UI components, and enhance API configuration)
=======
      message: 'Not authenticated',
>>>>>>> 3bc1751 (chore: Stage changes for turborepo migration)
=======
import { Context } from './context';

const t = initTRPC.context<Context>().create();

// Middleware to check authentication
const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
>>>>>>> 93399e0 (feat: add dashboard and product pages, integrate shared UI components, and enhance API configuration)
    });
  }
  return next({
    ctx: {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
      ...ctx,
=======
>>>>>>> 1100452 (feat: add dashboard and product pages, integrate shared UI components, and enhance API configuration)
=======
      ...ctx,
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
=======
>>>>>>> 93399e0 (feat: add dashboard and product pages, integrate shared UI components, and enhance API configuration)
      user: ctx.user,
    },
  });
});

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> c34d7d5 (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)
export const protectedProcedure = t.procedure.use(isAuthed);

// Re-export tier-specific procedures
import { withCreatorTier, withProTier, withEnterpriseTier } from './middleware/withTier';

export const creatorProcedure = protectedProcedure.use(withCreatorTier);
export const proProcedure = protectedProcedure.use(withProTier);
<<<<<<< HEAD
export const enterpriseProcedure = protectedProcedure.use(withEnterpriseTier);
=======
// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
>>>>>>> 1100452 (feat: add dashboard and product pages, integrate shared UI components, and enhance API configuration)
=======
// Protected procedures
export const protectedProcedure = t.procedure.use(isAuthed);

// Initialize the app router with our routes
export const appRouter = router({
  auth: authRouter,
  products: productRouter,
  orders: orderRouter,
});

// Export type router type signature
export type AppRouter = typeof appRouter;
>>>>>>> 3bc1751 (chore: Stage changes for turborepo migration)
=======
export const protectedProcedure = t.procedure.use(isAuthed);
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
=======
export const enterpriseProcedure = protectedProcedure.use(withEnterpriseTier);
>>>>>>> c34d7d5 (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)
=======
// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthenticated);
>>>>>>> 93399e0 (feat: add dashboard and product pages, integrate shared UI components, and enhance API configuration)
