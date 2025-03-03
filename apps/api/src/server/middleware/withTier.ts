import { TRPCError } from '@trpc/server';
import { t } from '../trpc';
import { SubscriptionTier } from '../../types/subscription';
import { Context } from '../context';

type Next = {
  ctx: Context;
};

/**
 * Middleware factory that creates a tier guard for procedures
 * @param requiredTier Minimum subscription tier required to access the procedure
 */
export const withTier = (requiredTier: SubscriptionTier) =>
  t.middleware(async ({ ctx, next }: { ctx: Context; next: () => Promise<Next> }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to access this resource',
      });
    }

    if (!ctx.hasRequiredTier(requiredTier)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `This feature requires ${requiredTier} tier or higher`,
      });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  });

// Pre-configured middleware for each tier
export const withCreatorTier = withTier('creator');
export const withProTier = withTier('pro');
export const withEnterpriseTier = withTier('enterprise');