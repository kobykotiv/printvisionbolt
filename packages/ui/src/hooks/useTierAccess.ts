import { useCallback } from 'react';
import type { UserTier } from '@printvisionbolt/api-types';
import { TIER_LIMITS, TIER_CONFIGS } from '@printvisionbolt/api-types/src/tiers';

export interface TierAccessOptions {
  minimumTier: UserTier;
  currentTier: UserTier;
  feature?: string;
}

export interface UseTierAccessResult {
  hasRequiredTier: (current: UserTier, required: UserTier) => boolean;
  canAccessFeature: (options: TierAccessOptions) => boolean;
  getTierLimits: (tier: UserTier) => typeof TIER_LIMITS[UserTier];
  getTierFeatures: (tier: UserTier) => typeof TIER_CONFIGS[UserTier]['features'];
  getTierGlassProps: (tier: UserTier) => {
    opacity: number;
    blur: number;
    border: boolean;
    performance: 'low' | 'medium' | 'high';
    accentColor?: string;
  };
  getUpgradeMessage: (current: UserTier, required: UserTier) => string;
}

const tierHierarchy: UserTier[] = ['free', 'creator', 'pro', 'enterprise'];

export function useTierAccess(): UseTierAccessResult {
  const hasRequiredTier = useCallback((currentTier: UserTier, requiredTier: UserTier): boolean => {
    const currentIndex = tierHierarchy.indexOf(currentTier);
    const requiredIndex = tierHierarchy.indexOf(requiredTier);
    return currentIndex >= requiredIndex;
  }, []);

  const canAccessFeature = useCallback(({ minimumTier, currentTier, feature }: TierAccessOptions): boolean => {
    if (!feature) return hasRequiredTier(currentTier, minimumTier);

    const tierConfig = TIER_CONFIGS[currentTier];
    if (!tierConfig) return false;

    // Check feature-specific access based on tier configuration
    return hasRequiredTier(currentTier, minimumTier);
  }, [hasRequiredTier]);

  const getTierLimits = useCallback((tier: UserTier) => {
    return TIER_LIMITS[tier];
  }, []);

  const getTierFeatures = useCallback((tier: UserTier) => {
    return TIER_CONFIGS[tier].features;
  }, []);

  const getTierGlassProps = useCallback((tier: UserTier) => {
    const glassEffects = {
      free: {
        opacity: 0.7,
        blur: 5,
        border: true,
        performance: 'low' as const
      },
      creator: {
        opacity: 0.8,
        blur: 8,
        border: true,
        performance: 'medium' as const,
        accentColor: '#6366f1' // Indigo
      },
      pro: {
        opacity: 0.85,
        blur: 10,
        border: true,
        performance: 'high' as const,
        accentColor: '#8b5cf6' // Purple
      },
      enterprise: {
        opacity: 0.9,
        blur: 12,
        border: true,
        performance: 'high' as const,
        accentColor: '#ec4899' // Pink
      }
    };

    return glassEffects[tier] || glassEffects.free;
  }, []);

  const getUpgradeMessage = useCallback((current: UserTier, required: UserTier): string => {
    const messages = {
      creator: 'Upgrade to Creator tier for enhanced features',
      pro: 'Upgrade to Pro tier for advanced capabilities',
      enterprise: 'Contact sales for Enterprise features'
    };

    return messages[required] || 'Upgrade your plan to access this feature';
  }, []);

  return {
    hasRequiredTier,
    canAccessFeature,
    getTierLimits,
    getTierFeatures,
    getTierGlassProps,
    getUpgradeMessage
  };
}