import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Database } from '../lib/database.types';
import { TEST_MODE, MOCK_SHOPS } from '../lib/test-mode';

type Shop = Database['public']['Tables']['shops']['Row'];

interface ShopContextType {
  currentShop: Shop | null;
  shops: Shop[];
  setCurrentShop: (shop: Shop) => void;
  loading: boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadShops();
    } else if (!user && TEST_MODE) {
      setShops([]);
      setCurrentShop(null);
      setLoading(false);
    }
  }, [user]);

  const loadShops = async () => {
    try {
      if (TEST_MODE) {
        setShops(MOCK_SHOPS as Shop[]);
        if (MOCK_SHOPS.length > 0 && !currentShop) {
          setCurrentShop(MOCK_SHOPS[0] as Shop);
        }
        setLoading(false);
        return;
      }

      const { data: userShops, error } = await supabase
        .from('shops')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      setShops(userShops);
      if (userShops.length > 0 && !currentShop) {
        setCurrentShop(userShops[0]);
      }
    } catch (error) {
      console.error('Error loading shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentShop,
    shops,
    setCurrentShop,
    loading,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
