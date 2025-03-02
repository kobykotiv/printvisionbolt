<<<<<<< HEAD
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
=======
import { ReactNode } from 'react'
import { cn } from '../../utils'

interface GlassCardProps {
  title: string
  value: string | number
  trend?: number
  loading?: boolean
  variant?: 'default' | 'success' | 'warning' | 'error'
  className?: string
  children?: ReactNode
}

export function GlassCard({
  title,
  value,
  trend,
  loading = false,
  variant = 'default',
  className,
  children
}: GlassCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg p-6',
        'bg-opacity-30 backdrop-blur-lg backdrop-filter',
        'border border-opacity-10',
        'shadow-xl transition-all duration-200',
        {
          'bg-white border-white': variant === 'default',
          'bg-green-500 border-green-200': variant === 'success',
          'bg-yellow-500 border-yellow-200': variant === 'warning',
          'bg-red-500 border-red-200': variant === 'error'
        },
        className
      )}
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {loading ? (
          <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
        ) : (
          <p className="text-2xl font-semibold">{value}</p>
        )}
        {trend !== undefined && (
          <p className={cn(
            'text-sm',
            trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-500'
          )}>
            {trend > 0 ? '↑' : trend < 0 ? '↓' : '−'} {Math.abs(trend)}%
          </p>
        )}
        {children}
      </div>
    </div>
  )
}
>>>>>>> 93399e0 (feat: add dashboard and product pages, integrate shared UI components, and enhance API configuration)
