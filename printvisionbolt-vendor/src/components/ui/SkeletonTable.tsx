import React from 'react';
import { Skeleton } from './Skeleton';

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export function SkeletonTable({ rows = 5, columns = 4 }: SkeletonTableProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="divide-y divide-gray-200">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-3">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={`header-${i}`} className="h-4 w-24" />
            ))}
          </div>
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="px-6 py-4">
            <div className="grid grid-cols-4 gap-4 items-center">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton
                  key={`cell-${rowIndex}-${colIndex}`}
                  className="h-4 w-full max-w-[200px]"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}