import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import type { Json } from '../../types/database';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['user', 'vendor']).default('user'),
  metadata: z.record(z.unknown()).nullable().optional()
});

export const authRouter = router({
  // Register new user
  register: publicProcedure
    .input(userSchema)
    .mutation(async ({ ctx, input }) => {
      const { supabase } = ctx;

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: input.email,
        password: input.password
      });

      if (authError || !authData.user) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user',
          cause: authError
        });
      }

      // Create user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: input.email,
          role: input.role,
          metadata: (input.metadata || null) as Json
        })
        .select()
        .single();

      if (profileError) {
        // Attempt to clean up auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user profile',
          cause: profileError
        });
      }

      return {
        user: profile,
        session: authData.session
      };
    }),

  // Login user
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const { supabase } = ctx;

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password
      });

      if (authError || !authData.user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials',
          cause: authError
        });
      }

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch user profile',
          cause: profileError
        });
      }

      return {
        user: profile,
        session: authData.session
      };
    }),

  // Get current user profile
  me: protectedProcedure
    .query(async ({ ctx }) => {
      const { supabase, user } = ctx;

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Not authenticated'
        });
      }

      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error || !profile) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User profile not found',
          cause: error
        });
      }

      return profile;
    }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(z.object({
      metadata: z.record(z.unknown()).nullable().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      const { supabase, user } = ctx;

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Not authenticated'
        });
      }

      const { data: profile, error } = await supabase
        .from('users')
        .update({
          metadata: (input.metadata || null) as Json,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error || !profile) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update profile',
          cause: error
        });
      }

      return profile;
    }),

  // Logout user
  logout: protectedProcedure
    .mutation(async ({ ctx }) => {
      const { supabase } = ctx;

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to logout',
          cause: error
        });
      }

      return { success: true };
    })
});