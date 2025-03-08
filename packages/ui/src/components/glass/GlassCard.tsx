import * as React from 'react';
import { cn } from '../../utils/cn';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gradientAccent?: string;
  blur?: 'sm' | 'md' | 'lg';
  opacity?: 'low' | 'medium' | 'high';
  noBorder?: boolean;
}

const blurValues = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
};

const opacityValues = {
  low: 'bg-opacity-20',
  medium: 'bg-opacity-30',
  high: 'bg-opacity-40',
};

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className,
      gradientAccent = 'from-white/20',
      blur = 'md',
      opacity = 'medium',
      noBorder = false,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-lg bg-white/10',
          blurValues[blur],
          opacityValues[opacity],
          !noBorder && 'border border-white/20',
          'shadow-xl',
          'before:absolute before:inset-0',
          `before:bg-gradient-to-br before:${gradientAccent} before:to-transparent before:opacity-30`,
          'dark:bg-black/10',
          className
        )}
        {...props}
      >
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';