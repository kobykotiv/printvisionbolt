import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useShop } from '../../contexts/ShopContext';
import type { SubscriptionTier } from '../../lib/types/subscription';
import type { Json } from '../../lib/database.types';
import { User } from 'lucide-react';

interface UsageStats {
  uploads: number;
  designs: number;
  collections: number;
  storage: {
    used: number;
    total: number;
  };
  apiCalls: {
    current: number;
    limit: number;
  };
}

interface ShopSettings extends Record<string, Json | undefined> {
  tier: SubscriptionTier;
}

export const UserStats: React.FC = () => {
  const { user } = useAuth();
  const { currentShop } = useShop();
  const [usageStats] = React.useState<UsageStats>({
    uploads: 0,
    designs: 0,
    collections: 0,
    storage: { used: 0, total: 100 },
    apiCalls: { current: 0, limit: 1000 }
  });

  const settings = currentShop?.settings as ShopSettings | undefined;
  const userTier: SubscriptionTier = settings?.tier || 'free';

  // Format bytes to human readable format
  const formatStorage = (bytes: number): string => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  // Calculate percentage
  const calculatePercentage = (current: number, total: number): number => {
    return Math.round((current / total) * 100);
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-80">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
        <User className="h-4 w-4 text-indigo-600" />
        </div>
        <div>
        <h3 className="font-semibold text-gray-900">Usage Statistics</h3>
        <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
      <span className="px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-full">
        {userTier.charAt(0).toUpperCase() + userTier.slice(1)}
      </span>
    </div>

      <div className="space-y-4">
        {/* Storage Usage */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Storage</span>
            <span className="text-gray-900">
              {formatStorage(usageStats.storage.used)} / {formatStorage(usageStats.storage.total)}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500"
              style={{ width: `${calculatePercentage(usageStats.storage.used, usageStats.storage.total)}%` }}
            />
          </div>
        </div>

        {/* API Usage */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">API Calls</span>
            <span className="text-gray-900">
              {usageStats.apiCalls.current} / {usageStats.apiCalls.limit}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500"
              style={{ width: `${calculatePercentage(usageStats.apiCalls.current, usageStats.apiCalls.limit)}%` }}
            />
          </div>
        </div>

        {/* Other Stats */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{usageStats.uploads}</div>
            <div className="text-xs text-gray-500">Uploads</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{usageStats.designs}</div>
            <div className="text-xs text-gray-500">Designs</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{usageStats.collections}</div>
            <div className="text-xs text-gray-500">Collections</div>
          </div>
        </div>
      </div>
    </div>
  );
};