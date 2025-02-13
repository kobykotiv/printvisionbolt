import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Store, User, ChevronDown, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { useShop } from '../contexts/ShopContext';
import { TierBasedNavigation } from './navigation/TierBasedNavigation';
import type { SubscriptionTier } from '../lib/types/subscription';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { currentShop, shops, setCurrentShop } = useShop();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  // Get tier from current shop's settings
  const userTier: SubscriptionTier = currentShop?.settings?.tier || 'free';

  const handleUpgradeClick = () => {
    if (currentShop) {
      navigate(`/app/billing?shop=${currentShop.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="flex flex-col h-16 px-6 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">PrintVision.Cloud</h1>
            </div>

            <div className="relative mt-2">
              <select
                value={currentShop?.id || ''}
                onChange={(e) => {
                  const shop = shops.find((s) => s.id === e.target.value);
                  if (shop) setCurrentShop(shop);
                }}
                className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              >
                <option value="">Select a shop</option>
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <Store className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            <TierBasedNavigation
              userTier={userTier}
              onUpgradeClick={handleUpgradeClick}
            />
            
            {/* User Widget */}
            <div className="mt-auto pt-4 border-t">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-2 py-1 w-full text-left text-sm hover:bg-gray-50 rounded-md mb-2"
              >
                <div className="flex items-center gap-2 flex-1">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {userTier.charAt(0).toUpperCase() + userTier.slice(1)} Plan
                    </p>
                  </div>
                </div>
                <ChevronDown className={cn(
                  "h-4 w-4 text-gray-400 transition-transform",
                  showUserMenu && "transform rotate-180"
                )} />
              </button>
              
              <button
                onClick={() => navigate('/app/settings')}
                className="flex items-center gap-2 px-2 py-1 w-full text-left text-sm text-gray-600 hover:bg-gray-50 rounded-md"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
              
              <button
                onClick={() => {
                  signOut();
                  navigate('/');
                }}
                className="flex items-center gap-2 px-2 py-1 w-full text-left text-sm text-red-600 hover:bg-red-50 rounded-md mt-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <main className="p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
