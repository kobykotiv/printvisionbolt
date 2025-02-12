import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProductData {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  status: string;
}

interface SortableProductProps {
  product: ProductData;
}

export function SortableProduct({ product }: SortableProductProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden',
        isDragging && 'shadow-lg ring-2 ring-indigo-500 opacity-90'
      )}
    >
      <div className="relative group">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        <button
          {...attributes}
          {...listeners}
          className="absolute top-2 right-2 p-1 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-gray-900">{product.title}</h3>
          <span className={cn(
            'px-2 py-1 text-xs font-medium rounded-full',
            product.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          )}>
            {product.status}
          </span>
        </div>
        <p className="text-lg font-bold text-gray-900">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
