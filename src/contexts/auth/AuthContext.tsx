import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

type UserRole = 'user' | 'admin';
type DemoType = 'standard' | 'admin';
type Provider = 'google' | 'github';

interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  permissions: string[];
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithProvider: (provider: Provider) => Promise<void>;
  loginAsDemo: (type: DemoType) => Promise<void>;
  signup: (credentials: { email: string; password: string; name: string }) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const BASE_PERMISSIONS = [
  'view:analytics',
  'view:designs',
  'view:collections',
  'create:designs',
  'edit:designs',
  'delete:designs',
];

const ADMIN_PERMISSIONS = [
  ...BASE_PERMISSIONS,
  'admin:users',
  'admin:settings',
  'admin:billing',
  'view:all_designs',
  'edit:all_designs',
  'delete:all_designs',
  'view:audit-logs',
];

const demoUsers = {
  standard: {
    id: 'demo-user',
    email: 'demo@printvision.cloud',
    password: 'Demo123!',
    role: 'user' as UserRole,
    name: 'Demo User',
    permissions: BASE_PERMISSIONS,
  },
  admin: {
    id: 'demo-admin',
    email: 'admin@printvision.cloud',
    password: 'Admin123!',
    role: 'admin' as UserRole,
    name: 'Demo Admin',
    permissions: ADMIN_PERMISSIONS,
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User> => {
  // Fetch user profile data from Supabase
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role, name')
    .eq('id', supabaseUser.id)
    .single();

  if (error) throw error;

  return {
    id: supabaseUser.id,
    email: supabaseUser.email!,
    role: (profile?.role as UserRole) || 'user',
    name: profile?.name || supabaseUser.email!.split('@')[0],
    permissions: profile?.role === 'admin' ? ADMIN_PERMISSIONS : BASE_PERMISSIONS,
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active session and initialize user
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const mappedUser = await mapSupabaseUser(session.user);
          setUser(mappedUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const mappedUser = await mapSupabaseUser(session.user);
        setUser(mappedUser);
      } else {
        setUser(null);
      }
    });

    initializeAuth();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async ({ email, password, rememberMe = false }: LoginCredentials) => {
    // Check for demo users first
    const demoUser = Object.values(demoUsers).find(
      user => user.email === email && user.password === password
    );

    if (demoUser) {
      setUser(demoUser);
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      return;
    }

    // Real authentication with Supabase
    const { data: { user: supabaseUser }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!supabaseUser) throw new Error('No user returned from Supabase');

    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    const mappedUser = await mapSupabaseUser(supabaseUser);
    setUser(mappedUser);
  };

  const loginWithProvider = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
  };

  const signup = async (credentials: { email: string; password: string; name: string }) => {
    const { data: { user: supabaseUser }, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
    if (!supabaseUser) throw new Error('No user returned from Supabase');

    // Create user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: supabaseUser.id,
          name: credentials.name,
          role: 'user',
        },
      ]);

    if (profileError) throw profileError;

    const mappedUser = await mapSupabaseUser(supabaseUser);
    setUser(mappedUser);
  };

  const loginAsDemo = async (type: DemoType) => {
    const demoUser = demoUsers[type];
    setUser(demoUser);
  };

  const logout = async () => {
    if (user && (user.id === 'demo-user' || user.id === 'demo-admin')) {
      setUser(null);
      return;
    }

    localStorage.removeItem('rememberedEmail');
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        loginWithProvider,
        loginAsDemo,
        signup,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
