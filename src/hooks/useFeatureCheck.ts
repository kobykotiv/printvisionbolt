import { useState, useEffect } from 'react';
import { useFeatures } from '../contexts/FeatureContext';
import { featureService } from '../services/features';

interface UseFeatureCheckResult {
  hasAccess: boolean;
  isLoading: boolean;
  error: Error | null;
}

export function useFeatureCheck(featureName: string): UseFeatureCheckResult {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { currentTier } = useFeatures();

  useEffect(() => {
    const checkFeatureAccess = async () => {
      try {
        setIsLoading(true);
        // First check if feature is available in current tier
        const featureInTier = currentTier.features[featureName as keyof typeof currentTier.features];
        
        if (typeof featureInTier === 'boolean') {
          setHasAccess(featureInTier);
          return;
        }

        // If not a direct boolean feature, check limits
        const limit = currentTier.limits.find(l => l.name === featureName);
        if (!limit) {
          setHasAccess(false);
          return;
        }

        // Check current usage against limit
        const usage = await featureService.getFeatureUsage(currentTier.id.toString(), featureName);
        setHasAccess(usage < limit.limit);
      } catch (err) {
        setError(err as Error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkFeatureAccess();
  }, [featureName, currentTier]);

  return {
    hasAccess,
    isLoading,
    error
  };
}

export function useFeatureRequired(featureName: string): boolean {
  const { hasAccess, isLoading } = useFeatureCheck(featureName);
  return !isLoading && hasAccess;
}

export default useFeatureCheck;
