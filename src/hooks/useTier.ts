export enum TierType {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}

export interface TierInfo {
  type: TierType;
  features: string[];
  isSubscribed: boolean;
}

export function useTier() {
  // This is a basic implementation - you might want to fetch this from an API
  // or your authentication/subscription service
  const getCurrentTier = (): TierInfo => {
    // Mock implementation - replace with actual tier detection logic
    return {
      type: TierType.FREE,
      features: ['basic-features'],
      isSubscribed: true
    };
  };

  return {
    currentTier: getCurrentTier(),
    isFree: getCurrentTier().type === TierType.FREE,
    isPro: getCurrentTier().type === TierType.PRO,
    isEnterprise: getCurrentTier().type === TierType.ENTERPRISE
  };
}
