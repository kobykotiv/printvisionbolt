import { inferAsyncReturnType } from '@trpc/server';
<<<<<<< HEAD
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { createClient, User } from '@supabase/supabase-js';
import { SubscriptionTier } from '../types/subscription';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface UserWithTier extends Omit<User, 'email'> {
  email: string;
  subscription_tier: SubscriptionTier;
}

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const token = req.headers.authorization?.split(' ')[1];
  
  let user: UserWithTier | null = null;
  if (token) {
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);
    if (!error && supabaseUser && supabaseUser.email) {
      // Fetch user data including subscription tier
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (!userError && userData) {
        user = {
          ...supabaseUser,
          email: supabaseUser.email, // Now we know email is defined
          subscription_tier: userData.subscription_tier as SubscriptionTier,
        };
      }
=======
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
>>>>>>> 1100452 (feat: add dashboard and product pages, integrate shared UI components, and enhance API configuration)
    }
  }

  return {
    req,
    res,
    supabase,
    user,
<<<<<<< HEAD
    /**
     * Helper function to check if the current user has required tier access
     */
    hasRequiredTier: (requiredTier: SubscriptionTier) => {
      if (!user) return false;
      const tierLevels: Record<SubscriptionTier, number> = {
        free: 0,
        creator: 1,
        pro: 2,
        enterprise: 3,
      };
      return tierLevels[user.subscription_tier] >= tierLevels[requiredTier];
    },
  };
}
=======
  };
};
>>>>>>> 1100452 (feat: add dashboard and product pages, integrate shared UI components, and enhance API configuration)

export type Context = inferAsyncReturnType<typeof createContext>;