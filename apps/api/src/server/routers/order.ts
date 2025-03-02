import { z } from 'zod';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
import { router, protectedProcedure } from '../trpc';
=======
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
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

<<<<<<< HEAD
      const { data: orders, error } = await query;
>>>>>>> 3bc1751 (chore: Stage changes for turborepo migration)
=======
      if (cursor) {
        query.lt('created_at', cursor);
      }

      const { data, error } = await query;
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
=======
import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import type { Database } from '../../types/database';
import type { Json } from '../../types/database';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderUpdate = Database['public']['Tables']['orders']['Update'];

const addressSchema = z.object({
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postal_code: z.string().min(1),
  country: z.string().min(1)
});

const orderItemSchema = z.object({
  product_id: z.string(),
  quantity: z.number().positive(),
  price: z.number().positive()
});

const orderInputSchema = z.object({
  shipping_address: addressSchema,
  billing_address: addressSchema,
  items: z.array(orderItemSchema).min(1),
  metadata: z.record(z.unknown()).nullable().optional()
});

export const orderRouter = router({
  // List user's orders
  list: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      cursor: z.string().nullish()
    }))
    .query(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Must be logged in to view orders'
        });
      }

      let query = supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(input.limit);

      if (input.cursor) {
        query = query.lt('created_at', input.cursor);
      }

      const { data: orders, error } = await query;
>>>>>>> 318c476 (chore: Stage changes for turborepo migration)

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
          message: 'Failed to fetch orders',
          cause: error
=======
          message: error.message,
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
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

<<<<<<< HEAD
      return order as Order & { order_items: any[] };
    })
>>>>>>> 3bc1751 (chore: Stage changes for turborepo migration)
=======
      return data as Order;
    }),
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
=======
          message: 'Failed to fetch orders',
          cause: error
        });
      }

      let nextCursor: string | null = null;
      if (orders && orders.length === input.limit) {
        nextCursor = orders[orders.length - 1].created_at;
      }

      return {
        items: orders as (Order & { order_items: any[] })[],
        nextCursor
      };
    }),

  // Get single order
  byId: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Must be logged in to view orders'
        });
      }

      const { data: order, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', input)
        .single();

      if (error || !order) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Order not found',
          cause: error
        });
      }

      // Verify ownership
      if (order.user_id !== user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to view this order'
        });
      }

      return order as Order & { order_items: any[] };
    }),

  // Create new order
  create: protectedProcedure
    .input(orderInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Must be logged in to create orders'
        });
      }

      // Start a Supabase transaction
      const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !supabaseUser) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Authentication failed'
        });
      }

      // Calculate total from items
      const total = input.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Create order
      const orderInsert: OrderInsert = {
        user_id: user.id,
        status: 'pending',
        total,
        shipping_address: input.shipping_address as Json,
        billing_address: input.billing_address as Json,
        metadata: (input.metadata || null) as Json
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderInsert)
        .select()
        .single();

      if (orderError || !order) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create order',
          cause: orderError
        });
      }

      // Create order items
      const orderItems = input.items.map(item => ({
        order_id: order.id,
        ...item,
        metadata: null
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        // Attempt to rollback the order
        await supabase
          .from('orders')
          .delete()
          .eq('id', order.id);

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create order items',
          cause: itemsError
        });
      }

      // Fetch the complete order with items
      const { data: completeOrder, error: fetchError } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', order.id)
        .single();

      if (fetchError || !completeOrder) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch complete order',
          cause: fetchError
        });
      }

      return completeOrder as Order & { order_items: any[] };
    }),

  // Update order status
  updateStatus: protectedProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    }))
    .mutation(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Must be logged in to update orders'
        });
      }

      // Verify ownership
      const { data: existing } = await supabase
        .from('orders')
        .select('user_id')
        .eq('id', input.id)
        .single();

      if (!existing || existing.user_id !== user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to update this order'
        });
      }

      const { data: order, error } = await supabase
        .from('orders')
        .update({ status: input.status })
        .eq('id', input.id)
        .select('*, order_items(*)')
        .single();

      if (error || !order) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update order status',
          cause: error
        });
      }

      return order as Order & { order_items: any[] };
    })
>>>>>>> 318c476 (chore: Stage changes for turborepo migration)
});