import { inferAsyncReturnType } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const createContext = async ({ req, res }: CreateNextContextOptions) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  let user = null;
  if (token) {
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);
    if (!error && supabaseUser) {
      user = supabaseUser;
    }
  }

  return {
    req,
    res,
    supabase,
    user,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;