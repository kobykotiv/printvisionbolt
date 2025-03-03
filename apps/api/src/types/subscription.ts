export type SubscriptionTier = 'free' | 'creator' | 'pro' | 'enterprise';

export const tierLevels: Record<SubscriptionTier, number> = {
  free: 0,
  creator: 1,
  pro: 2,
  enterprise: 3,
};

export interface TierFeatureLimit {
  products: number;
  analytics: 'basic' | 'enhanced' | 'advanced' | 'custom';
  bulkOperations: boolean;
  apiAccess: boolean;
  customization: 'basic' | 'advanced' | 'custom' | 'branded';
}

export const tierLimits: Record<SubscriptionTier, TierFeatureLimit> = {
  free: {
    products: 10,
    analytics: 'basic',
    bulkOperations: false,
    apiAccess: false,
    customization: 'basic',
  },
  creator: {
    products: 100,
    analytics: 'enhanced',
    bulkOperations: true,
    apiAccess: false,
    customization: 'advanced',
  },
  pro: {
    products: 1000,
    analytics: 'advanced',
    bulkOperations: true,
    apiAccess: true,
    customization: 'custom',
  },
  enterprise: {
    products: Infinity,
    analytics: 'custom',
    bulkOperations: true,
    apiAccess: true,
    customization: 'branded',
  },
};

export function hasRequiredTier(
  currentTier: SubscriptionTier,
  requiredTier: SubscriptionTier
): boolean {
  return tierLevels[currentTier] >= tierLevels[requiredTier];
}

export function getTierLimit<K extends keyof TierFeatureLimit>(
  tier: SubscriptionTier,
  feature: K
): TierFeatureLimit[K] {
  return tierLimits[tier][feature];
}