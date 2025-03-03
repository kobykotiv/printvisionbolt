import { useCallback } from 'react';
import type { Feature, UserTier, FeatureLimit, TierFeatures, UseTierAccessResult } from './types';

const TIER_LEVELS: Record<UserTier, number> = {
  free: 0,
  creator: 1,
  pro: 2,
  enterprise: 3
};

const FEATURES: TierFeatures = {
  templateSync: { minTier: 'creator' },
  bulkOperations: { minTier: 'pro' },
  customGradients: { minTier: 'creator' },
  advancedAnimations: { minTier: 'pro' },
  versionControl: { minTier: 'creator' },
  teamCollaboration: { 
    minTier: 'pro',
    limits: {
      free: 0,
      creator: 0,
      pro: 5,
      enterprise: 'unlimited'
    }
  },
  templatePreview: {
    minTier: 'creator'
  },
  publishing: {
    minTier: 'creator'
  },
  advancedSettings: {
    minTier: 'pro'
  },
  apiAccess: {
    minTier: 'creator',
    limits: {
      free: 0,
      creator: 1000,
      pro: 10000,
      enterprise: 'unlimited'
    }
  },
  templates: {
    minTier: 'free',
    limits: {
      free: 5,
      creator: 20,
      pro: 100,
      enterprise: 'unlimited'
    }
  }
};

export const useTierAccess = (): UseTierAccessResult => {
  // TODO: Replace with actual user tier from auth context
  const currentTier: UserTier = 'free';

  const hasFeature = useCallback((feature: Feature): boolean => {
    const featureConfig = FEATURES[feature];
    if (!featureConfig) return false;

    return TIER_LEVELS[currentTier] >= TIER_LEVELS[featureConfig.minTier];
  }, [currentTier]);

  const getFeatureLimit = useCallback((feature: Feature): FeatureLimit => {
    const featureConfig = FEATURES[feature];
    if (!featureConfig?.limits) return 0;

    return featureConfig.limits[currentTier];
  }, [currentTier]);

  const canAccessTier = useCallback((requiredTier: UserTier): boolean => {
    return TIER_LEVELS[currentTier] >= TIER_LEVELS[requiredTier];
  }, [currentTier]);

  return {
    tier: currentTier,
    hasFeature,
    getFeatureLimit,
    canAccessTier
  };
};