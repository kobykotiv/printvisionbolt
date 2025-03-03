import { router } from './trpc';
import { productRouter } from './routers/product';
import { orderRouter } from './routers/order';
import { authRouter } from './routers/auth';

export const appRouter = router({
  product: productRouter,
  order: orderRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;