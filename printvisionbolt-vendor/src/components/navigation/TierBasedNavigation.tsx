import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useShop } from '../../contexts/ShopContext';
import {
  LayoutDashboard,
  Palette,
  Upload,
  FileStack,
  FolderGit2,
  Store,
  Plug2,
  CreditCard,
  Lock,
  ChevronRight
} from 'lucide-react';
import type { SubscriptionTier } from '../../lib/types/subscription';
import { TIER_FEATURES } from '../../lib/types/subscription';
import { cn } from '../../lib/utils';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  minTier: SubscriptionTier;
  beta?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/app', label: 'Dashboard', icon: LayoutDashboard, minTier: 'free' },
  { path: '/app/designs', label: 'Designs', icon: Palette, minTier: 'free' },
  { path: '/app/bulk-upload', label: 'Upload', icon: Upload, minTier: 'free' },
  { path: '/app/templates', label: 'Templates', icon: FileStack, minTier: 'free' },
  { path: '/app/collections', label: 'Collections', icon: FolderGit2, minTier: 'creator' },
  { path: '/app/shops', label: 'Shops', icon: Store, minTier: 'creator' },
  { path: '/app/api', label: 'API Access', icon: Plug2, minTier: 'pro', beta: true },
  { path: '/app/billing', label: 'Billing', icon: CreditCard, minTier: 'free' }
];

const TIER_ORDER: SubscriptionTier[] = ['free', 'creator', 'pro', 'enterprise'];

function isTierSufficient(userTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean {
  return TIER_ORDER.indexOf(userTier) >= TIER_ORDER.indexOf(requiredTier);
}

interface TierBasedNavigationProps {
  userTier: SubscriptionTier;
  onUpgradeClick?: () => void;
}

export function TierBasedNavigation({ userTier, onUpgradeClick }: TierBasedNavigationProps) {
  const location = useLocation();
  const { currentShop } = useShop();
  
  // Don't show navigation if no shop is selected
  if (!currentShop) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-gray-500">Please select a shop to continue</p>
      </div>
    );
  }

  return (
    <nav className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        const isLocked = !isTierSufficient(userTier, item.minTier);

        return (
          <div key={item.path} className="relative group">
            <Link
              to={isLocked ? '#' : item.path}
              onClick={(e) => {
                if (isLocked) {
                  e.preventDefault();
                  onUpgradeClick?.();
                }
              }}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors relative',
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50',
                isLocked && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Icon className={cn(
                'flex-shrink-0 h-5 w-5 mr-3',
                isActive ? 'text-indigo-600' : 'text-gray-400'
              )} />
              <span className="flex-1">{item.label}</span>
              {item.beta && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                  Beta
                </span>
              )}
              {isLocked && (
                <Lock className="h-4 w-4 text-gray-400 ml-2" />
              )}
            </Link>

            {/* Upgrade tooltip */}
            {isLocked && (
              <div className="absolute left-full ml-2 invisible group-hover:visible">
                <div className="bg-gray-900 text-white text-sm rounded-lg py-1 px-3 flex items-center">
                  <span>Upgrade to {item.minTier} tier</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            )}
          </div>
        );
      })}

      {userTier !== 'enterprise' && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-gray-500 text-center">
            Current shop: {currentShop.name}
          </p>
          <button
            onClick={onUpgradeClick}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Upgrade Shop Plan
          </button>
        </div>
      )}
    </nav>
  );
}