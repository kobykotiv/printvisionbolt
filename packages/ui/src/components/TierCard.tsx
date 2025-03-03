import React from 'react';
import { GlassContainer, type GlassContainerProps } from './GlassContainer';
import { useTierAccess } from '../hooks/useTierAccess';
import type { UserTier } from '@printvisionbolt/api-types';

interface TierCardProps {
  tier: UserTier;
  limits: {
    itemsPerSupplier: number;
    templatesCount: number;
    designUploadsPerDay: number;
    hasAds: boolean;
    pricePerMonth: number;
  };
  isCurrentTier?: boolean;
  onUpgrade?: () => void;
}

export const TierCard: React.FC<TierCardProps> = ({
  tier,
  limits,
  isCurrentTier = false,
  onUpgrade
}) => {
  const { getTierGlassProps } = useTierAccess();
  const glassProps = getTierGlassProps(tier);

  return (
    <GlassContainer
      {...glassProps}
      className={`tier-card ${isCurrentTier ? 'current-tier' : ''}`}
      style={{
        width: '300px',
        padding: '24px',
        borderRadius: '12px'
      }}
    >
      <div className="tier-header">
        <h3 className="tier-name">
          {tier.charAt(0).toUpperCase() + tier.slice(1)}
        </h3>
        {tier !== 'free' && (
          <div className="tier-price">
            ${limits.pricePerMonth}
            <span className="tier-price-period">/mo</span>
          </div>
        )}
      </div>

      <div className="tier-features">
        <ul>
          <li>
            {limits.itemsPerSupplier === -1 ? (
              'Unlimited items per supplier'
            ) : (
              `Up to ${limits.itemsPerSupplier} items per supplier`
            )}
          </li>
          <li>
            {limits.templatesCount === -1 ? (
              'Unlimited templates'
            ) : (
              `Up to ${limits.templatesCount} templates`
            )}
          </li>
          <li>
            {limits.designUploadsPerDay === -1 ? (
              'Unlimited design uploads'
            ) : (
              `${limits.designUploadsPerDay} design uploads per day`
            )}
          </li>
          <li>
            {limits.hasAds ? 'Ad supported' : 'No ads'}
          </li>
        </ul>
      </div>

      {!isCurrentTier && onUpgrade && (
        <button
          onClick={onUpgrade}
          className="upgrade-button"
          style={{
            backgroundColor: glassProps.accentColor || '#6366f1',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            width: '100%',
            marginTop: '16px'
          }}
        >
          {tier === 'enterprise' ? 'Contact Sales' : 'Upgrade Now'}
        </button>
      )}

      {isCurrentTier && (
        <div
          className="current-plan-badge"
          style={{
            backgroundColor: glassProps.accentColor || '#6366f1',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '0.875rem',
            textAlign: 'center',
            marginTop: '16px'
          }}
        >
          Current Plan
        </div>
      )}
    </GlassContainer>
  );
};

export default TierCard;