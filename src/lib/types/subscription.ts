export type SubscriptionTier = 'free' | 'creator' | 'pro' | 'enterprise';

export interface TierLimits {
  designs: number;
  templates: number;
  dailyUploads: number;
  stores: number;
}

export const TIER_LIMITS: Record<SubscriptionTier, TierLimits> = {
  free: {
    designs: 5,
    templates: 3,
    dailyUploads: 10,
    stores: 1
  },
  creator: {
    designs: 10,
    templates: 10,
    dailyUploads: 100,
    stores: 2
  },
  pro: {
    designs: 100,
    templates: 50,
    dailyUploads: 500,
    stores: 5
  },
  enterprise: {
    designs: -1, // Unlimited
    templates: -1, // Unlimited
    dailyUploads: -1, // Unlimited
    stores: -1 // Unlimited
  }
};

export interface TierFeatures {
  detailedStats: boolean;
  bulkOperations: boolean;
  apiAccess: boolean;
  scheduledDrops: boolean;
  autoSync: boolean;
  multiStore: boolean;
  webhooks: boolean;
  autoTags: boolean;
}

export const TIER_FEATURES: Record<SubscriptionTier, TierFeatures> = {
  free: {
    detailedStats: false,
    bulkOperations: false,
    apiAccess: false,
    scheduledDrops: false,
    autoSync: false,
    multiStore: false,
    webhooks: false,
    autoTags: false
  },
  creator: {
    detailedStats: true,
    bulkOperations: true,
    apiAccess: true,
    scheduledDrops: false,
    autoSync: false,
    multiStore: false,
    webhooks: false,
    autoTags: false
  },
  pro: {
    detailedStats: true,
    bulkOperations: true,
    apiAccess: true,
    scheduledDrops: true,
    autoSync: true,
    multiStore: false,
    webhooks: false,
    autoTags: false
  },
  enterprise: {
    detailedStats: true,
    bulkOperations: true,
    apiAccess: true,
    scheduledDrops: true,
    autoSync: true,
    multiStore: true,
    webhooks: true,
    autoTags: true
  }
};