export type FeatureTier = 'free' | 'creator' | 'pro' | 'enterprise';

export interface FeatureLimit {
  name: string;
  currentUsage: number;
  limit: number;
  resetAt?: Date;
}

export interface UICustomization {
  gradientAccents: string[];
  glassEffects: string[];
}

export interface PerformanceFeatures {
  bunOptimizations?: boolean;
  edgeDeployment?: boolean;
  customCaching?: boolean;
}

export interface TierFeatures {
  customDomain: boolean;
  productLimit: number | 'unlimited';
  storageLimit: string | 'customizable';
  analytics: 'basic' | 'enhanced' | 'advanced' | 'custom';
  templates: string[];
  advancedSearch?: boolean;
  multiLanguage?: boolean;
  dedicatedSupport?: boolean;
  uiCustomization: UICustomization;
  performanceFeatures?: PerformanceFeatures;
}

export interface UserTier {
  id: number;
  name: FeatureTier;
  features: TierFeatures;
  limits: FeatureLimit[];
}

export interface FeatureContextType {
  currentTier: UserTier;
  checkFeatureAccess: (featureName: string) => boolean;
  getFeatureLimit: (featureName: string) => FeatureLimit | null;
  remainingUsage: (featureName: string) => number;
  checkUpgradeRequired: (featureName: string) => boolean;
  upgradeUrl: string;
}
