export type UserTier = 'free' | 'creator' | 'pro' | 'enterprise';

export interface TierLimits {
  itemsPerSupplier: number;
  templatesCount: number;
  designUploadsPerDay: number;
  hasAds: boolean;
  pricePerMonth: number;
}

export const TIER_LIMITS: Record<UserTier, TierLimits> = {
  free: {
    itemsPerSupplier: 5,
    templatesCount: 3,
    designUploadsPerDay: 10,
    hasAds: true,
    pricePerMonth: 0
  },
  creator: {
    itemsPerSupplier: 10,
    templatesCount: 10,
    designUploadsPerDay: -1, // unlimited
    hasAds: false,
    pricePerMonth: 1
  },
  pro: {
    itemsPerSupplier: 30,
    templatesCount: 20,
    designUploadsPerDay: -1, // unlimited
    hasAds: false,
    pricePerMonth: 9
  },
  enterprise: {
    itemsPerSupplier: -1, // unlimited
    templatesCount: -1, // unlimited
    designUploadsPerDay: -1, // unlimited
    hasAds: false,
    pricePerMonth: 29
  }
};

export interface TierFeatures {
  analytics: {
    basicMetrics: boolean;
    enhancedMetrics: boolean;
    advancedMetrics: boolean;
    customMetrics: boolean;
    exportData: 'none' | 'basic' | 'advanced' | 'custom';
  };
  products: {
    management: 'basic' | 'enhanced' | 'advanced' | 'custom';
    templates: string[];
    bulkActions: boolean;
    apiAccess: boolean;
    customIntegrations: boolean;
  };
  customization: {
    glassEffects: 'basic' | 'advanced' | 'custom' | 'branded';
    gradients: string[];
    animations: boolean;
    darkMode: boolean;
    whiteLabel: boolean;
  };
  providers: {
    available: string[];
    rateLimits: {
      requestsPerMinute: number;
      dailyQuota: number;
    };
    features: {
      bulkOperations: boolean;
      webhooks: boolean;
      customIntegrations: boolean;
    };
  };
}

export interface TierConfig {
  name: UserTier;
  limits: TierLimits;
  features: TierFeatures;
}

export const TIER_CONFIGS: Record<UserTier, TierConfig> = {
  free: {
    name: 'free',
    limits: TIER_LIMITS.free,
    features: {
      analytics: {
        basicMetrics: true,
        enhancedMetrics: false,
        advancedMetrics: false,
        customMetrics: false,
        exportData: 'none'
      },
      products: {
        management: 'basic',
        templates: ['default'],
        bulkActions: false,
        apiAccess: false,
        customIntegrations: false
      },
      customization: {
        glassEffects: 'basic',
        gradients: ['default'],
        animations: false,
        darkMode: true,
        whiteLabel: false
      },
      providers: {
        available: ['printify'],
        rateLimits: {
          requestsPerMinute: 30,
          dailyQuota: 1000
        },
        features: {
          bulkOperations: false,
          webhooks: false,
          customIntegrations: false
        }
      }
    }
  },
  creator: {
    name: 'creator',
    limits: TIER_LIMITS.creator,
    features: {
      analytics: {
        basicMetrics: true,
        enhancedMetrics: true,
        advancedMetrics: false,
        customMetrics: false,
        exportData: 'basic'
      },
      products: {
        management: 'enhanced',
        templates: ['default', 'premium'],
        bulkActions: true,
        apiAccess: false,
        customIntegrations: false
      },
      customization: {
        glassEffects: 'advanced',
        gradients: ['default', 'custom'],
        animations: true,
        darkMode: true,
        whiteLabel: false
      },
      providers: {
        available: ['printify', 'printful'],
        rateLimits: {
          requestsPerMinute: 60,
          dailyQuota: 5000
        },
        features: {
          bulkOperations: true,
          webhooks: false,
          customIntegrations: false
        }
      }
    }
  },
  pro: {
    name: 'pro',
    limits: TIER_LIMITS.pro,
    features: {
      analytics: {
        basicMetrics: true,
        enhancedMetrics: true,
        advancedMetrics: true,
        customMetrics: false,
        exportData: 'advanced'
      },
      products: {
        management: 'advanced',
        templates: ['default', 'premium', 'custom'],
        bulkActions: true,
        apiAccess: true,
        customIntegrations: false
      },
      customization: {
        glassEffects: 'custom',
        gradients: ['default', 'custom', 'animated'],
        animations: true,
        darkMode: true,
        whiteLabel: true
      },
      providers: {
        available: ['printify', 'printful', 'gooten'],
        rateLimits: {
          requestsPerMinute: 120,
          dailyQuota: 20000
        },
        features: {
          bulkOperations: true,
          webhooks: true,
          customIntegrations: false
        }
      }
    }
  },
  enterprise: {
    name: 'enterprise',
    limits: TIER_LIMITS.enterprise,
    features: {
      analytics: {
        basicMetrics: true,
        enhancedMetrics: true,
        advancedMetrics: true,
        customMetrics: true,
        exportData: 'custom'
      },
      products: {
        management: 'custom',
        templates: ['default', 'premium', 'custom', 'enterprise'],
        bulkActions: true,
        apiAccess: true,
        customIntegrations: true
      },
      customization: {
        glassEffects: 'branded',
        gradients: ['default', 'custom', 'animated', 'branded'],
        animations: true,
        darkMode: true,
        whiteLabel: true
      },
      providers: {
        available: ['printify', 'printful', 'gooten', 'gelato'],
        rateLimits: {
          requestsPerMinute: 300,
          dailyQuota: 100000
        },
        features: {
          bulkOperations: true,
          webhooks: true,
          customIntegrations: true
        }
      }
    }
  }
};