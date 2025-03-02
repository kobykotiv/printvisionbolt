import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import type { Database } from '../../types/database';
import type { Json } from '../../types/database';

type Product = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

// Input schema for product creation/updates
const productInputSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(1),
  price: z.number().positive(),
  images: z.array(z.string().url()).min(1),
  status: z.enum(['draft', 'published', 'archived']),
  stock: z.number().min(0),
  metadata: z.record(z.unknown()).nullable().optional(),
  category_id: z.string().optional()
});

export const productRouter = router({
  // Get all published products
  list: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      cursor: z.string().nullish(),
      categoryId: z.string().optional()
    }))
    .query(async ({ ctx, input }) => {
      const { supabase } = ctx;
      let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(input.limit);

      if (input.cursor) {
        query = query.lt('created_at', input.cursor);
      }

      if (input.categoryId) {
        query = query.eq('category_id', input.categoryId);
      }

      const { data: products, error } = await query;

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch products',
          cause: error
        });
      }

      let nextCursor: string | null = null;
      if (products && products.length === input.limit) {
        nextCursor = products[products.length - 1].created_at;
      }

      return {
        items: products as Product[],
        nextCursor
      };
    }),

  // Get a single product by ID
  byId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { data: product, error } = await ctx.supabase
        .from('products')
        .select('*')
        .eq('id', input)
        .single();

      if (error || !product) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found',
          cause: error
        });
      }

      return product as Product;
    }),

  // Create a new product (protected route)
  create: protectedProcedure
    .input(productInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Must be logged in to create products'
        });
      }

      const productInsert: ProductInsert = {
        ...input,
        vendor_id: user.id,
        metadata: (input.metadata || null) as Json
      };

      const { data: product, error } = await supabase
        .from('products')
        .insert(productInsert)
        .select()
        .single();

      if (error || !product) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create product',
          cause: error
        });
      }

      return product as Product;
    }),

  // Update a product (protected route)
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: productInputSchema.partial()
    }))
    .mutation(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Must be logged in to update products'
        });
      }

      // First check if user owns the product
      const { data: existing } = await supabase
        .from('products')
        .select('vendor_id')
        .eq('id', input.id)
        .single();

      if (!existing || existing.vendor_id !== user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to update this product'
        });
      }

      const updateData: ProductUpdate = {
        ...input.data,
        metadata: input.data.metadata ? (input.data.metadata as Json) : undefined
      };

      const { data: product, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', input.id)
        .select()
        .single();

      if (error || !product) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update product',
          cause: error
        });
      }

      return product as Product;
    }),

  // Delete a product (protected route)
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Must be logged in to delete products'
        });
      }

      // First check if user owns the product
      const { data: existing } = await supabase
        .from('products')
        .select('vendor_id')
        .eq('id', input)
        .single();

      if (!existing || existing.vendor_id !== user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to delete this product'
        });
      }

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', input);

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete product',
          cause: error
        });
      }

      return { success: true };
    })
});