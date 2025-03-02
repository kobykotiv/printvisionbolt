<<<<<<< HEAD
<<<<<<< HEAD
'use client';

import React, { forwardRef } from 'react';
import { cn } from '../../utils';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  value?: string | number;
  trend?: number;
  loading?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
  children?: React.ReactNode;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-lg p-6',
          'bg-opacity-30 backdrop-blur-lg backdrop-filter',
          'border border-opacity-10',
          'shadow-xl transition-all duration-200',
          {
            'bg-white/50 border-white/50': variant === 'default',
            'bg-green-500/50 border-green-200/50': variant === 'success',
            'bg-yellow-500/50 border-yellow-200/50': variant === 'warning',
            'bg-red-500/50 border-red-200/50': variant === 'error'
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
=======
import { ReactNode } from 'react'
import { cn } from '../../utils'
=======
'use client';
>>>>>>> 3bc1751 (chore: Stage changes for turborepo migration)

import React, { forwardRef } from 'react';
import { cn } from '../../utils';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  value?: string | number;
  trend?: number;
  loading?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
  children?: React.ReactNode;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden rounded-lg p-6',
          'bg-opacity-30 backdrop-blur-lg backdrop-filter',
          'border border-opacity-10',
          'shadow-xl transition-all duration-200',
          {
            'bg-white/50 border-white/50': variant === 'default',
            'bg-green-500/50 border-green-200/50': variant === 'success',
            'bg-yellow-500/50 border-yellow-200/50': variant === 'warning',
            'bg-red-500/50 border-red-200/50': variant === 'error'
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
<<<<<<< HEAD
    </div>
  )
}
>>>>>>> 1100452 (feat: add dashboard and product pages, integrate shared UI components, and enhance API configuration)
=======
    );
  }
);

GlassCard.displayName = 'GlassCard';
>>>>>>> 3bc1751 (chore: Stage changes for turborepo migration)
