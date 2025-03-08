import React from 'react';
import { useFeatures } from '../contexts/FeatureContext';
import { UpgradePrompt } from './UpgradePrompt';

interface FeatureGuardProps {
  feature: string;
  children: React.ReactNode;
  showUpgradePrompt?: boolean;
  fallback?: React.ReactNode;
}

export const FeatureGuard: React.FC<FeatureGuardProps> = ({
  feature,
  children,
  showUpgradePrompt = true,
  fallback
}) => {
  const { checkFeatureAccess, checkUpgradeRequired } = useFeatures();
  const hasAccess = checkFeatureAccess(feature);
  const needsUpgrade = checkUpgradeRequired(feature);

  if (!hasAccess) {
    if (showUpgradePrompt && needsUpgrade) {
      return <UpgradePrompt feature={feature} />;
    }
    return fallback || null;
  }

  return <>{children}</>;
};

export default FeatureGuard;
