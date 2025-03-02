import { useEffect, useState, useCallback } from 'react';
import { useFeatures } from '../contexts/FeatureContext';
import { FeatureLimit } from '../types/features';
import { featureService } from '../services/features';

interface UseFeatureLimitResult {
  limit: FeatureLimit | null;
  isLoading: boolean;
  error: Error | null;
  checkAccess: () => boolean;
  incrementUsage: () => Promise<void>;
  resetUsage: () => Promise<void>;
}

export function useFeatureLimit(featureName: string): UseFeatureLimitResult {
  const { currentTier } = useFeatures();
  const [limit, setLimit] = useState<FeatureLimit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Get the initial limit from the user's tier
  useEffect(() => {
    const tierLimit = currentTier.limits.find(l => l.name === featureName);
    if (tierLimit) {
      setLimit(tierLimit);
    }
    setIsLoading(false);
  }, [currentTier, featureName]);

  // Check if user has access to the feature
  const checkAccess = useCallback(() => {
    if (!limit) return false;
    return limit.currentUsage < limit.limit;
  }, [limit]);

  // Increment usage counter
  const incrementUsage = useCallback(async () => {
    if (!limit) return;

    try {
      setIsLoading(true);
      await featureService.incrementFeatureUsage(currentTier.id.toString(), featureName);
      
      setLimit(prev => {
        if (!prev) return null;
        return {
          ...prev,
          currentUsage: prev.currentUsage + 1
        };
      });
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentTier.id, featureName, limit]);

  // Reset usage counter
  const resetUsage = useCallback(async () => {
    if (!limit) return;

    try {
      setIsLoading(true);
      await featureService.resetFeatureUsage(currentTier.id.toString(), featureName);
      
      setLimit(prev => {
        if (!prev) return null;
        return {
          ...prev,
          currentUsage: 0,
          resetAt: new Date()
        };
      });
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentTier.id, featureName, limit]);

  return {
    limit,
    isLoading,
    error,
    checkAccess,
    incrementUsage,
    resetUsage
  };
}

export default useFeatureLimit;
