import { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { inferAsyncReturnType } from '@trpc/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Initialize Supabase client with proper types
const supabase = createClient<Database>(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

// Export user type
export interface User {
  id: string;
  role: 'user' | 'vendor' | 'admin';
}

export const createContext = async ({ req, res }: CreateExpressContextOptions) => {
  // Get the user token from the authorization header
  const token = req.headers.authorization?.split(' ')[1];
  
  let user: User | null = null;
  
  if (token) {
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);
    if (!error && supabaseUser) {
      // Get user role from database
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', supabaseUser.id)
        .single();

      user = {
        id: supabaseUser.id,
        role: userData?.role || 'user'
      };
    }
  }

  return {
    req,
    res,
    supabase,
    user
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;