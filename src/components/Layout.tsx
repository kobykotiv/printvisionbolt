import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useShop } from '@/contexts/ShopContext';
import { TierBasedNavigation } from '@/components/navigation/TierBasedNavigation';
import type { SubscriptionTier } from '@printvision/shared/types';
import { FreeUsageWidget } from '@/components/ui/FreeUsageWidget';
import { LoginWidget } from '@/components/auth/LoginWidget';
import { UserStats } from '@/components/user/UserStats';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoginWidget />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex justify-between items-center px-4 py-2">
            <div className="flex items-center space-x-4">
              <img 
                src="/printvision-logo.svg" 
                alt="PrintVision.Cloud" 
                className="h-8 w-auto" 
              />
              <span className="text-xl font-semibold">PrintVision.Cloud</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
              >
                <User className="h-5 w-5" />
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <TierBasedNavigation />

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-gray-50 p-6">
            {children}
          </main>
        </div>

        {/* Footer Stats */}
        <div className="fixed bottom-4 right-4">
          <UserStats />
        </div>
      </div>
    </div>
  );
}
