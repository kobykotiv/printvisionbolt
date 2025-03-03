import { initTRPC, TRPCError } from '@trpc/server';
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
    });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);

// Re-export tier-specific procedures
import { withCreatorTier, withProTier, withEnterpriseTier } from './middleware/withTier';

export const creatorProcedure = protectedProcedure.use(withCreatorTier);
export const proProcedure = protectedProcedure.use(withProTier);
export const enterpriseProcedure = protectedProcedure.use(withEnterpriseTier);