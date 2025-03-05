import React, { createContext, useContext, useEffect, useState } from 'react';
import type { FeatureContextType, UserTier, FeatureLimit } from '@printvision/shared/types';
import { featureTiers } from '@/lib/config/features';

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export const useFeatures = () => {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error('useFeatures must be used within a FeatureProvider');
  }
  return context;
};

interface FeatureProviderProps {
  children: React.ReactNode;
  initialTier?: UserTier;
}

export const FeatureProvider: React.FC<FeatureProviderProps> = ({
  children,
  initialTier,
}) => {
  const [currentTier, setCurrentTier] = useState<UserTier>(
    initialTier || featureTiers.free
  );

  const checkFeatureAccess = (featureName: string): boolean => {
    const feature = currentTier.features[featureName as keyof typeof currentTier.features];
    if (typeof feature === 'boolean') return feature;
    return false;
  };

  const getFeatureLimit = (featureName: string): FeatureLimit | null => {
    return currentTier.limits.find((limit) => limit.name === featureName) || null;
  };

  const remainingUsage = (featureName: string): number => {
    const limit = getFeatureLimit(featureName);
    if (!limit) return 0;
    return Math.max(0, limit.limit - limit.currentUsage);
  };

  const checkUpgradeRequired = (featureName: string): boolean => {
    const limit = getFeatureLimit(featureName);
    if (!limit) return true;
    return limit.currentUsage >= limit.limit;
  };

  const value: FeatureContextType = {
    currentTier,
    checkFeatureAccess,
    getFeatureLimit,
    remainingUsage,
    checkUpgradeRequired,
    upgradeUrl: '/upgrade',
  };

  return (
    <FeatureContext.Provider value={value}>
      {children}
    </FeatureContext.Provider>
  );
};

export default FeatureContext;
