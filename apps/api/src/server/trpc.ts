import { initTRPC, TRPCError } from '@trpc/server';
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
      message: 'Not authenticated',
    });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

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