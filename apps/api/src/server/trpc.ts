import { initTRPC, TRPCError } from '@trpc/server';
<<<<<<< HEAD
import type { Context } from './context';

export const t = initTRPC.context<Context>().create({
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

const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware to check authentication
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
    });
  }
  return next({
    ctx: {
<<<<<<< HEAD
      ...ctx,
=======
>>>>>>> 1100452 (feat: add dashboard and product pages, integrate shared UI components, and enhance API configuration)
      user: ctx.user,
    },
  });
});

<<<<<<< HEAD
<<<<<<< HEAD
export const protectedProcedure = t.procedure.use(isAuthed);

// Re-export tier-specific procedures
import { withCreatorTier, withProTier, withEnterpriseTier } from './middleware/withTier';

export const creatorProcedure = protectedProcedure.use(withCreatorTier);
export const proProcedure = protectedProcedure.use(withProTier);
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
