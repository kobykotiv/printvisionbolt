import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Database } from '../lib/database.types';
import { TEST_MODE, MOCK_SHOPS } from '../lib/test-mode';

const MAX_FREE_TIER_SHOPS = 1;

type Shop = Database['public']['Tables']['shops']['Row'];

interface ShopContextType {
  currentShop: Shop | null;
  shops: Shop[];
  setCurrentShop: (shop: Shop) => void;
  loading: boolean;
  canCreateShop: boolean;
  isAtShopLimit: boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAtShopLimit, setIsAtShopLimit] = useState(false);
  const canCreateShop = !isAtShopLimit;
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
          const lastUsedShopId = localStorage.getItem('lastUsedShopId');
          const lastShop = MOCK_SHOPS.find(s => s.id === lastUsedShopId);
          setCurrentShop(lastShop || MOCK_SHOPS[0] as Shop);
        }
        setIsAtShopLimit(MOCK_SHOPS.length >= MAX_FREE_TIER_SHOPS);
        setLoading(false);
        return;
      }

      const { data: userShops, error } = await supabase
        .from('shops')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      // Check if user is at shop limit
      const userSettings = await supabase
        .from('user_settings')
        .select('settings')
        .single();

      const tier = userSettings.data?.settings?.tier || 'free';
      setIsAtShopLimit(tier === 'free' && userShops.length >= MAX_FREE_TIER_SHOPS);

      setShops(userShops);
      if (userShops.length > 0 && !currentShop) {
        const lastUsedShopId = localStorage.getItem('lastUsedShopId');
        const lastShop = userShops.find(s => s.id === lastUsedShopId);
        setCurrentShop(lastShop || userShops[0]);
      }
    } catch (error) {
      console.error('Error loading shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShopChange = (shop: Shop) => {
    setCurrentShop(shop);
    localStorage.setItem('lastUsedShopId', shop.id);
  };

  const value = {
    currentShop,
    shops,
    setCurrentShop: handleShopChange,
    loading,
    canCreateShop,
    isAtShopLimit
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