import { inferAsyncReturnType } from '@trpc/server';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { createClient, User } from '@supabase/supabase-js';
import { SubscriptionTier } from '../types/subscription';
<<<<<<< HEAD

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
=======
>>>>>>> 3bc1751 (chore: Stage changes for turborepo migration)
=======
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
import { createClient } from '@supabase/supabase-js';
=======
>>>>>>> c34d7d5 (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)

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
<<<<<<< HEAD
    if (!error && supabaseUser) {
<<<<<<< HEAD
<<<<<<< HEAD
      user = supabaseUser;
>>>>>>> 1100452 (feat: add dashboard and product pages, integrate shared UI components, and enhance API configuration)
=======
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
>>>>>>> 3bc1751 (chore: Stage changes for turborepo migration)
=======
      user = supabaseUser;
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
=======
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
>>>>>>> c34d7d5 (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)
=======
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
=======
>>>>>>> 318c476 (chore: Stage changes for turborepo migration)
=======
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
>>>>>>> dc00547 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const token = req.headers.authorization?.split(' ')[1];
  
  let user = null;
  if (token) {
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);
    if (!error && supabaseUser) {
<<<<<<< HEAD
<<<<<<< HEAD
      user = supabaseUser;
>>>>>>> 93399e0 (feat: add dashboard and product pages, integrate shared UI components, and enhance API configuration)
=======
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
>>>>>>> 318c476 (chore: Stage changes for turborepo migration)
=======
      user = supabaseUser;
>>>>>>> dc00547 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
    }
  }

  return {
    req,
    res,
    supabase,
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
    user
>>>>>>> 3bc1751 (chore: Stage changes for turborepo migration)
  };
};
>>>>>>> 1100452 (feat: add dashboard and product pages, integrate shared UI components, and enhance API configuration)
=======
    user,
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
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
=======
    user,
=======
    user
>>>>>>> 318c476 (chore: Stage changes for turborepo migration)
  };
};
>>>>>>> 93399e0 (feat: add dashboard and product pages, integrate shared UI components, and enhance API configuration)
=======
    user,
  };
}
>>>>>>> dc00547 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)

export type Context = inferAsyncReturnType<typeof createContext>;