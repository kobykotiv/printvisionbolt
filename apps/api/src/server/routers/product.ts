import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import type { Product } from '../../types/database';

const productInput = z.object({
  title: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  metadata: z.record(z.unknown()).optional(),
  images: z.array(z.string()).default([]),
  category_id: z.string().nullable(),
  store_id: z.string(),
  print_provider_id: z.string().nullable(),
  stock: z.number().default(0),
  vendor_id: z.string(),
  variants: z.array(z.record(z.unknown())).default([]),
  shipping_profile_id: z.string().nullable(),
});

export const productRouter = router({
  list: publicProcedure
    .input(
      z.object({
        store_id: z.string(),
        status: z.enum(['draft', 'published', 'archived']).optional(),
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { store_id, status, limit, cursor } = input;
      const query = ctx.supabase
        .from('products')
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
        items: data as Product[],
        nextCursor,
      };
    }),

  create: protectedProcedure
    .input(productInput)
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('products')
        .insert([input])
        .select()
        .single();

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }

      return data as Product;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: productInput.partial(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('products')
        .update(input.data)
        .eq('id', input.id)
        .select()
        .single();

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }

      return data as Product;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      const { error } = await ctx.supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }

      return { success: true };
    }),

  get: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      const { data, error } = await ctx.supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found',
        });
      }

      return data as Product;
    }),
});