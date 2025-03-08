import React from 'react';
import { useFeatures } from '../contexts/FeatureContext';
import { FeatureTier } from '../types/features';

export interface UpgradePromptProps {
  feature: string;
  currentTier?: FeatureTier;
  requiredTier?: FeatureTier;
  className?: string;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  feature,
  currentTier,
  requiredTier,
  className
}) => {
  const { currentTier: contextTier, upgradeUrl } = useFeatures();
  const userTier = currentTier || contextTier.name;
  const targetTier = requiredTier || getRequiredTierForFeature(feature);

  return (
    <div className={`upgrade-prompt ${className || ''}`}>
      <div className="upgrade-prompt-content">
        <h3 className="text-xl font-semibold mb-2">
          Upgrade Required
        </h3>
        <p className="text-gray-600 mb-4">
          {getUpgradeMessage(feature, userTier, targetTier)}
        </p>
        <div className="upgrade-actions">
          <a
            href={upgradeUrl}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Upgrade Now
          </a>
        </div>
      </div>
    </div>
  );
};

function getUpgradeMessage(feature: string, currentTier: FeatureTier, requiredTier: FeatureTier): string {
  return `The ${feature} feature requires the ${requiredTier} plan. Please upgrade from your current ${currentTier} plan to access this feature.`;
}

function getRequiredTierForFeature(feature: string): FeatureTier {
  // Map features to their minimum required tier
  const featureTierMap: Record<string, FeatureTier> = {
    customDomain: 'creator',
    advancedSearch: 'creator',
    multiLanguage: 'pro',
    dedicatedSupport: 'enterprise',
    // Add more feature-to-tier mappings here
  };

  return featureTierMap[feature] || 'pro';
}

export default UpgradePrompt;
