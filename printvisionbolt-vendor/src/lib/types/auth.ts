import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface User extends SupabaseUser {
  avatar_url?: string;
  full_name?: string;
  billing_address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  settings?: {
    notifications: {
      email: boolean;
      push: boolean;
      desktop: boolean;
    };
    marketing_emails: boolean;
    theme: 'light' | 'dark' | 'system';
  };
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}