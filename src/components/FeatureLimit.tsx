import React from 'react';
import { useFeatureLimit } from '../hooks/useFeatureLimit';

interface FeatureLimitProps {
  feature: string;
  className?: string;
  showWarningAt?: number; // Percentage at which to show warning (e.g., 80)
}

export const FeatureLimit: React.FC<FeatureLimitProps> = ({
  feature,
  className = '',
  showWarningAt = 80
}) => {
  const { limit, isLoading, error } = useFeatureLimit(feature);

  if (isLoading) {
    return <div className="animate-pulse h-4 bg-gray-200 rounded w-full" />;
  }

  if (error || !limit) {
    return null;
  }

  const percentageUsed = (limit.currentUsage / limit.limit) * 100;
  const isNearLimit = percentageUsed >= showWarningAt;
  const isAtLimit = limit.currentUsage >= limit.limit;

  return (
    <div className={`feature-limit ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          {feature} Usage
        </span>
        <span className="text-sm text-gray-500">
          {limit.currentUsage} / {limit.limit === Number.MAX_SAFE_INTEGER ? '∞' : limit.limit}
        </span>
      </div>
      <div className="relative h-2 bg-gray-200 rounded">
        <div
          className={`absolute left-0 h-full rounded transition-all ${
            isAtLimit
              ? 'bg-red-500'
              : isNearLimit
              ? 'bg-yellow-500'
              : 'bg-green-500'
          }`}
          style={{ width: `${Math.min(percentageUsed, 100)}%` }}
        />
      </div>
      {isNearLimit && !isAtLimit && (
        <p className="mt-1 text-sm text-yellow-600">
          You&apos;re approaching your {feature} limit
        </p>
      )}
      {isAtLimit && (
        <p className="mt-1 text-sm text-red-600">
          You&apos;ve reached your {feature} limit
        </p>
      )}
      {limit.resetAt && (
        <p className="mt-1 text-xs text-gray-500">
          Resets on {new Date(limit.resetAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default FeatureLimit;
