import React from 'react';
import { TierType } from '../../hooks/useTier';

interface UpgradePromptProps {
  requiredTier: TierType;
  message?: string;
  children?: React.ReactNode;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  requiredTier,
  message = 'This feature requires an upgrade',
  children
}) => {
  return (
    <div className="upgrade-prompt">
      <h3>{message}</h3>
      <p>Required tier: {requiredTier}</p>
      <button className="upgrade-button">
        Upgrade Now
      </button>
      {children}
    </div>
  );
};
