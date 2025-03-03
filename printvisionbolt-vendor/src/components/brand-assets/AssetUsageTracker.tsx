import React from 'react';
import { Link2, Package, Grid, Calendar } from 'lucide-react';
import type { BrandAsset } from '../../lib/types/brand-asset';

interface AssetUsageTrackerProps {
  asset: BrandAsset;
}

export function AssetUsageTracker({ asset }: AssetUsageTrackerProps) {
  const usageCount = {
    products: asset.usage.products.length,
    collections: asset.usage.collections.length,
    templates: asset.usage.templates.length
  };

  const totalUsage = Object.values(usageCount).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Usage Tracking</h3>
        <div className="flex items-center gap-2 text-sm">
          <Link2 className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-900">{totalUsage}</span>
          <span className="text-gray-500">total uses</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-indigo-500" />
            <span className="text-sm font-medium text-gray-900">Products</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {usageCount.products}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Grid className="h-5 w-5 text-indigo-500" />
            <span className="text-sm font-medium text-gray-900">Collections</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {usageCount.collections}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-500" />
            <span className="text-sm font-medium text-gray-900">Templates</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {usageCount.templates}
          </p>
        </div>
      </div>
    </div>
  );
}