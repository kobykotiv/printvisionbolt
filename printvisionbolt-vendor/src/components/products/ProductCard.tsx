import React from 'react';
import { Edit, Trash2, Tag, Package, AlertTriangle } from 'lucide-react';
import type { Product } from '../../lib/types/product';
import { cn } from '../../lib/utils';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const hasLowStock = product.variants.some(v => v.stock < 5);
  const isOutOfStock = product.variants.every(v => v.stock === 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden group">
      {/* Product Image */}
      <div className="aspect-w-4 aspect-h-3 bg-gray-100 relative">
        {product.metadata.imageUrl && (
          <img
            src={product.metadata.imageUrl as string}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span className={cn(
            "px-2 py-1 text-xs font-medium rounded-full",
            product.status === 'active' ? "bg-green-100 text-green-800" :
            product.status === 'draft' ? "bg-yellow-100 text-yellow-800" :
            "bg-gray-100 text-gray-800"
          )}>
            {product.status}
          </span>
        </div>

        {/* Stock Warning */}
        {(hasLowStock || isOutOfStock) && (
          <div className="absolute top-2 left-2">
            <span className={cn(
              "flex items-center px-2 py-1 text-xs font-medium rounded-full",
              isOutOfStock ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
            )}>
              <AlertTriangle className="h-3 w-3 mr-1" />
              {isOutOfStock ? 'Out of Stock' : 'Low Stock'}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(product)}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
              >
                <Edit className="h-4 w-4 text-gray-600" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(product)}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900">{product.title}</h3>
        
        <div className="mt-2 flex items-center justify-between text-sm">
          <div className="text-gray-500">
            <Package className="h-4 w-4 inline mr-1" />
            {product.provider}
          </div>
          <div className="font-medium text-gray-900">
            ${product.pricing.basePrice}
          </div>
        </div>

        {/* Variants Summary */}
        <div className="mt-2 flex flex-wrap gap-1">
          {product.variants.slice(0, 3).map(variant => (
            <span
              key={variant.id}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
            >
              <Tag className="h-3 w-3 mr-1" />
              {variant.title}
            </span>
          ))}
          {product.variants.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              +{product.variants.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}