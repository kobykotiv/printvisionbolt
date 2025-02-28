import React from 'react';
import { Clock, Link as LinkIcon, Check, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AssetCardProps {
  id: string;
  title: string;
  thumbnail: string;
  type: string;
  status: 'synced' | 'pending' | 'error';
  lastModified: string;
  usageCount: number;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export function AssetCard({
  id,
  title,
  thumbnail,
  type,
  status,
  lastModified,
  usageCount,
  selected,
  onSelect
}: AssetCardProps) {
  const statusIcon = {
    synced: <Check className="h-4 w-4 text-green-500" />,
    pending: <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />,
    error: <AlertTriangle className="h-4 w-4 text-red-500" />
  };

  return (
    <div
      className={cn(
        "group relative bg-white rounded-lg shadow-sm border transition-shadow hover:shadow-md",
        selected && "ring-2 ring-indigo-500"
      )}
    >
      <div className="aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-t-lg bg-gray-100">
        <img
          src={thumbnail}
          alt={title}
          className="pointer-events-none object-cover group-hover:opacity-75"
        />
        <button
          type="button"
          className="absolute inset-0 focus:outline-none"
          onClick={() => onSelect?.(id)}
        >
          <span className="sr-only">View details for {title}</span>
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{type}</p>
          </div>
          {statusIcon[status]}
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {new Date(lastModified).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <LinkIcon className="h-4 w-4 mr-1" />
            {usageCount} uses
          </div>
        </div>
      </div>
    </div>
  );
}