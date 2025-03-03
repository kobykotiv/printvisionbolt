import React from 'react';
import type { Store } from '../../lib/types/store';
import { ExternalLink } from 'lucide-react';

interface Props {
  store: Store;
  onSelect: (store: Store) => void;
}

export function StoreCard({ store, onSelect }: Props) {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 hover:bg-gray-50 cursor-pointer"
      onClick={() => onSelect(store)}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{store.name}</h3>
          <p className="text-sm text-gray-500">{store.provider}</p>
        </div>
        <a
          href={store.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-700"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
