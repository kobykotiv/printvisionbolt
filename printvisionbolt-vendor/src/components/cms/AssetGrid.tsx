import React from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { AssetCard } from './AssetCard';

interface Asset {
  id: string;
  title: string;
  thumbnail: string;
  type: string;
  status: 'synced' | 'pending' | 'error';
  lastModified: string;
  usageCount: number;
}

interface AssetGridProps {
  assets: Asset[];
  selectedAssets: string[];
  onSelectAsset: (id: string) => void;
  onReorder?: (assets: Asset[]) => void;
}

export function AssetGrid({
  assets,
  selectedAssets,
  onSelectAsset,
  onReorder
}: AssetGridProps) {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = assets.findIndex((item) => item.id === active.id);
      const newIndex = assets.findIndex((item) => item.id === over.id);
      const newAssets = arrayMove(assets, oldIndex, newIndex);
      onReorder?.(newAssets);
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={assets.map(asset => asset.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-6">
          {assets.map((asset) => (
            <AssetCard
              key={asset.id}
              {...asset}
              selected={selectedAssets.includes(asset.id)}
              onSelect={onSelectAsset}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}