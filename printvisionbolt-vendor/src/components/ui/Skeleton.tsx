import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  animate?: boolean;
}

export function Skeleton({ className, animate = true }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-gray-200 rounded-md',
        animate && 'animate-pulse',
        className
      )}
    />
  );
}