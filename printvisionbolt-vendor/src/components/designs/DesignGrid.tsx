import React from 'react';
import { Design } from '../../lib/types/design';
import { ContextMenu } from '../ui/ContextMenu';
import { Checkbox } from '../ui/Checkbox';
import { motion } from 'framer-motion';

interface Props {
  designs: Design[];
  selectedIds: Set<string>;
  onSelect: (ids: string[]) => void;
  onDelete: (ids: string[]) => void;
  onEdit: (design: Design) => void;
  gridSize?: number;
}

export function DesignGrid({
  designs,
  selectedIds,
  onSelect,
  onDelete,
  onEdit,
  gridSize = 4
}: Props) {
  return (
    <div className={`grid grid-cols-${gridSize} gap-4`}>
      {designs.map(design => (
        <motion.div
          key={design.id}
          layoutId={design.id}
          className="relative group"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className={`
            aspect-square rounded-lg overflow-hidden border-2
            ${selectedIds.has(design.id) ? 'border-indigo-500' : 'border-transparent'}
            hover:border-indigo-300
          `}>
            <img
              src={design.thumbnailUrl}
              alt={design.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Checkbox
              checked={selectedIds.has(design.id)}
              onChange={() => {
                const newIds = new Set(selectedIds);
                if (newIds.has(design.id)) {
                  newIds.delete(design.id);
                } else {
                  newIds.add(design.id);
                }
                onSelect(Array.from(newIds));
              }}
            />
          </div>

          <ContextMenu
            items={[
              {
                label: 'Edit',
                onClick: () => onEdit(design)
              },
              {
                label: 'Delete',
                onClick: () => onDelete([design.id]),
                variant: 'destructive'
              }
            ]}
          />

          <div className="mt-2">
            <h3 className="text-sm font-medium text-gray-900">{design.name}</h3>
            <p className="text-sm text-gray-500">{design.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
