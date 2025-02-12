import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { TEST_MODE, MOCK_USER, DEMO_TOKEN } from '../lib/test-mode';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithToken: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (TEST_MODE) {
      setUser(MOCK_USER as User);
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithToken = async (token: string) => {
    if (TEST_MODE && token === DEMO_TOKEN) {
      setUser(MOCK_USER as User);
      return;
    }

    throw new Error('Invalid demo token');
  };

  const value = {
    user,
    signIn: TEST_MODE ? async () => {
      setUser(MOCK_USER as User); 
    } : async (email: string, password: string) => { 
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    }, 
    signInWithToken,
    signOut: TEST_MODE ? async () => {
      setUser(null);
    } : async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}