import { TierFeatures, UserTier } from '../types/features';

const commonFeatures = {
  productListing: true,
  basicSearch: true,
  shoppingCart: true,
  checkout: true,
  orderTracking: true,
  glassomorphicUI: {
    baseEffects: true,
    responsiveDesign: true,
    darkMode: true
  }
};

const freeTierFeatures: TierFeatures = {
  customDomain: false,
  productLimit: 50,
  storageLimit: '2GB',
  analytics: 'basic',
  templates: ['default'],
  uiCustomization: {
    gradientAccents: ['default'],
    glassEffects: ['basic']
  }
};

const creatorTierFeatures: TierFeatures = {
  customDomain: true,
  productLimit: 200,
  storageLimit: '10GB',
  analytics: 'enhanced',
  templates: ['default', 'premium'],
  advancedSearch: true,
  uiCustomization: {
    gradientAccents: ['default', 'custom'],
    glassEffects: ['basic', 'advanced']
  }
};

const proTierFeatures: TierFeatures = {
  customDomain: true,
  productLimit: 'unlimited',
  storageLimit: '50GB',
  analytics: 'advanced',
  templates: ['default', 'premium', 'custom'],
  advancedSearch: true,
  multiLanguage: true,
  uiCustomization: {
    gradientAccents: ['default', 'custom', 'animated'],
    glassEffects: ['basic', 'advanced', 'custom']
  },
  performanceFeatures: {
    bunOptimizations: true,
    edgeDeployment: true
  }
};

const enterpriseTierFeatures: TierFeatures = {
  customDomain: true,
  productLimit: 'unlimited',
  storageLimit: 'customizable',
  analytics: 'custom',
  templates: ['default', 'premium', 'custom'],
  advancedSearch: true,
  multiLanguage: true,
  dedicatedSupport: true,
  uiCustomization: {
    gradientAccents: ['default', 'custom', 'animated', 'branded'],
    glassEffects: ['basic', 'advanced', 'custom', 'branded']
  },
  performanceFeatures: {
    bunOptimizations: true,
    edgeDeployment: true,
    customCaching: true
  }
};

export const featureTiers: Record<string, UserTier> = {
  free: {
    id: 1,
    name: 'free',
    features: freeTierFeatures,
    limits: [
      {
        name: 'products',
        currentUsage: 0,
        limit: 50
      },
      {
        name: 'storage',
        currentUsage: 0,
        limit: 2 * 1024 * 1024 * 1024 // 2GB in bytes
      }
    ]
  },
  creator: {
    id: 2,
    name: 'creator',
    features: creatorTierFeatures,
    limits: [
      {
        name: 'products',
        currentUsage: 0,
        limit: 200
      },
      {
        name: 'storage',
        currentUsage: 0,
        limit: 10 * 1024 * 1024 * 1024 // 10GB in bytes
      }
    ]
  },
  pro: {
    id: 3,
    name: 'pro',
    features: proTierFeatures,
    limits: [
      {
        name: 'products',
        currentUsage: 0,
        limit: Number.MAX_SAFE_INTEGER
      },
      {
        name: 'storage',
        currentUsage: 0,
        limit: 50 * 1024 * 1024 * 1024 // 50GB in bytes
      }
    ]
  },
  enterprise: {
    id: 4,
    name: 'enterprise',
    features: enterpriseTierFeatures,
    limits: [
      {
        name: 'products',
        currentUsage: 0,
        limit: Number.MAX_SAFE_INTEGER
      },
      {
        name: 'storage',
        currentUsage: 0,
        limit: Number.MAX_SAFE_INTEGER
      }
    ]
  }
};

export const getDefaultTier = (): UserTier => featureTiers.free;

export const getTierByName = (name: string): UserTier => {
  return featureTiers[name] || getDefaultTier();
};

export const getTierById = (id: number): UserTier => {
  return Object.values(featureTiers).find(tier => tier.id === id) || getDefaultTier();
};
