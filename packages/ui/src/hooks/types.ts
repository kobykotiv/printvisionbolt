import type { UserTier } from '@printvisionbolt/api-types';

export interface TierAccessOptions {
  minimumTier: UserTier;
  currentTier: UserTier;
  feature?: string;
}

export interface GlassProps {
  opacity: number;
  blur: number;
  border: boolean;
  performance: 'low' | 'medium' | 'high';
  accentColor?: string;
}

export interface TierAccessHook {
  hasRequiredTier: (current: UserTier, required: UserTier) => boolean;
  canAccessFeature: (options: TierAccessOptions) => boolean;
  getTierGlassProps: (tier: UserTier) => GlassProps;
  getUpgradeMessage: (current: UserTier, required: UserTier) => string;
}