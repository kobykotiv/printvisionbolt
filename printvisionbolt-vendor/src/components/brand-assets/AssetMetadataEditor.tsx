import React from 'react';
import { useForm } from 'react-hook-form';
import type { AssetMetadata } from '../../lib/types/brand-asset';

interface AssetMetadataEditorProps {
  metadata: AssetMetadata;
  onSave: (metadata: AssetMetadata) => Promise<void>;
}

export function AssetMetadataEditor({
  metadata,
  onSave
}: AssetMetadataEditorProps) {
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<AssetMetadata>({
    defaultValues: metadata
  });

  const [saving, setSaving] = React.useState(false);

  const handleSave = async (data: AssetMetadata) => {
    setSaving(true);
    try {
      await onSave(data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Metadata</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Width (px)
            </label>
            <input
              type="number"
              {...register('width', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Height (px)
            </label>
            <input
              type="number"
              {...register('height', { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Usage Rights
          </label>
          <div className="mt-2 space-y-4">
            <div>
              <label className="block text-sm text-gray-500">License</label>
              <input
                type="text"
                {...register('usageRights.license', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500">
                Expiration Date
              </label>
              <input
                type="date"
                {...register('usageRights.expiresAt')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500">
                Restrictions
              </label>
              <textarea
                {...register('usageRights.restrictions')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter usage restrictions, one per line"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isDirty || saving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}