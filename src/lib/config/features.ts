import { UserTier, TierConfig } from '@printvision/api-types/tiers';

export const featureTiers = {
  free: {
    id: 1,
    name: 'Free',
    features: {
      basicDesigns: true,
      basicAnalytics: true,
    },
    limits: [
      { name: 'designCount', limit: 5, currentUsage: 0 },
      { name: 'monthlyViews', limit: 100, currentUsage: 0 },
    ]
  }
};

export function getTierById(id: number): UserTier {
  const tier = Object.values(featureTiers).find((t: UserTier) => t.id === id);
  if (!tier) {
    throw new Error(`Tier with id ${id} not found`);
  }
  return tier;
}

export function getDefaultTierConfig(): TierConfig {
  return {
    defaultTierId: 1,
    tiers: [featureTiers.free]
  };
}