import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from '../trpc';
import { orderInputSchema } from '@printvisionbolt/api-types/routers';
import type { Order } from '@printvisionbolt/api-types/database';

export const orderRouter = router({
  list: protectedProcedure
    .input(z.object({
      store_id: z.string(),
      limit: z.number().min(1).max(100).default(10),
      cursor: z.string().nullish(),
      status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { store_id, limit, cursor, status } = input;
      
      const query = ctx.supabase
        .from('orders')
        .select('*')
        .eq('store_id', store_id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (status) {
        query.eq('status', status);
      }

      if (cursor) {
        query.lt('created_at', cursor);
      }

      const { data, error } = await query;

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }

      let nextCursor: string | undefined = undefined;
      if (data.length === limit) {
        nextCursor = data[data.length - 1].created_at;
      }

      return {
        items: data as Order[],
        nextCursor,
      };
    }),

  create: protectedProcedure
    .input(orderInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('orders')
        .insert([input])
        .select()
        .single();

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }

      return data as Order;
    }),

  get: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      const { data, error } = await ctx.supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Order not found',
        });
      }

      return data as Order;
    }),

  updateStatus: protectedProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('orders')
        .update({ status: input.status })
        .eq('id', input.id)
        .select()
        .single();

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }

      return data as Order;
    }),
});