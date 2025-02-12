import React from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, Save } from 'lucide-react';
import type { Template, Blueprint } from '../../lib/types/template';
import { TEST_MODE } from '../../lib/test-mode';

interface TemplateFormProps {
  template?: Template;
  onSave: (template: Template) => Promise<void>;
}

export function TemplateForm({ template, onSave }: TemplateFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors, isDirty } } = useForm<Template>({
    defaultValues: template || {
      id: '',
      title: '',
      description: '',
      blueprints: [],
      tags: [],
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  });

  const [loadingBlueprints, setLoadingBlueprints] = React.useState(false);
  const [availableBlueprints, setAvailableBlueprints] = React.useState<Blueprint[]>([]);
  const selectedBlueprints = watch('blueprints');

  React.useEffect(() => {
    loadBlueprints();
  }, []);

  const loadBlueprints = async () => {
    setLoadingBlueprints(true);
    try {
      if (TEST_MODE) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setAvailableBlueprints([
          {
            id: 'bp-1',
            title: 'Classic T-Shirt',
            provider: 'printify',
            providerId: 'pfy-1',
            variants: [
              { id: 'v1', title: 'White / S', sku: 'TS-W-S', options: { color: 'White', size: 'S' } },
              { id: 'v2', title: 'White / M', sku: 'TS-W-M', options: { color: 'White', size: 'M' } }
            ],
            placeholders: [
              {
                id: 'ph-1',
                name: 'Front Print',
                width: 12,
                height: 16,
                x: 0,
                y: 0,
                rotation: 0,
                required: true,
                constraints: {
                  minDpi: 150,
                  maxDpi: 300,
                  allowedFormats: ['png', 'jpg']
                }
              }
            ],
            pricing: {
              baseCost: 15,
              retailPrice: 29.99
            }
          }
        ]);
        return;
      }

      // In a real app, fetch blueprints from your API
      const response = await fetch('/api/blueprints');
      const data = await response.json();
      setAvailableBlueprints(data);
    } catch (error) {
      console.error('Error loading blueprints:', error);
    } finally {
      setLoadingBlueprints(false);
    }
  };

  const addBlueprint = (blueprint: Blueprint) => {
    const currentBlueprints = watch('blueprints');
    setValue('blueprints', [...currentBlueprints, blueprint], { shouldDirty: true });
  };

  const removeBlueprint = (blueprintId: string) => {
    const currentBlueprints = watch('blueprints');
    setValue(
      'blueprints',
      currentBlueprints.filter(bp => bp.id !== blueprintId),
      { shouldDirty: true }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <input
            type="text"
            {...register('tags')}
            placeholder="Enter tags separated by commas"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            {...register('status')}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900">Blueprints</h3>
          <div className="mt-4 space-y-4">
            {selectedBlueprints.map((blueprint) => (
              <div
                key={blueprint.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{blueprint.title}</h4>
                  <p className="text-sm text-gray-500">
                    {blueprint.variants.length} variants
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeBlueprint(blueprint.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}

            <div className="relative">
              <button
                type="button"
                onClick={() => addBlueprint(availableBlueprints[0])}
                disabled={loadingBlueprints}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Blueprint
              </button>
              {loadingBlueprints && (
                <p className="mt-2 text-sm text-gray-500">Loading blueprints...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!isDirty}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Template
        </button>
      </div>
    </form>
  );
}