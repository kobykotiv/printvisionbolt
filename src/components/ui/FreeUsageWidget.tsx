import React from 'react';
import { FileText, Layout, Upload } from 'lucide-react';
import { cn } from '../../lib/utils';

interface UsageData {
  templatesCount: number;
  itemsPerTemplate: { [key: string]: number };
  designUploadsToday: number;
}

const LIMITS = {
  TEMPLATES: 3,
  ITEMS_PER_TEMPLATE: 5,
  DAILY_UPLOADS: 10,
};

interface ProgressBarProps {
  current: number;
  max: number;
  label: string;
}

function ProgressBar({ current, max, label }: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className={cn(
          'font-medium',
          isAtLimit ? 'text-red-600' : isNearLimit ? 'text-amber-600' : 'text-gray-600'
        )}>
          {current}/{max}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-amber-500' : 'bg-indigo-500'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Mock data for demo account
const mockUsageData: UsageData = {
  templatesCount: 2,
  itemsPerTemplate: {
    'Template 1': 4,
    'Template 2': 5,
  },
  designUploadsToday: 8,
};

export function FreeUsageWidget() {
  const { templatesCount, itemsPerTemplate, designUploadsToday } = mockUsageData;

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Free Tier Usage</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Layout className="h-5 w-5 text-indigo-500" />
          <span className="font-medium text-gray-900">Templates</span>
        </div>
        <ProgressBar
          current={templatesCount}
          max={LIMITS.TEMPLATES}
          label="Active Templates"
        />

        <div className="flex items-center gap-2 mb-2 mt-6">
          <FileText className="h-5 w-5 text-indigo-500" />
          <span className="font-medium text-gray-900">Items per Template</span>
        </div>
        {Object.entries(itemsPerTemplate).map(([template, count]) => (
          <ProgressBar
            key={template}
            current={count}
            max={LIMITS.ITEMS_PER_TEMPLATE}
            label={template}
          />
        ))}

        <div className="flex items-center gap-2 mb-2 mt-6">
          <Upload className="h-5 w-5 text-indigo-500" />
          <span className="font-medium text-gray-900">Daily Design Uploads</span>
        </div>
        <ProgressBar
          current={designUploadsToday}
          max={LIMITS.DAILY_UPLOADS}
          label="Uploads Today"
        />
      </div>
    </div>
  );
}