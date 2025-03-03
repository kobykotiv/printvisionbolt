import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Save, Upload } from 'lucide-react';
import type { TemplateDesign, Blueprint } from '../../lib/types/template';
import { BlueprintSelectorModal } from './BlueprintSelectorModal';
import { DesignUploader } from '../designs/DesignUploader';

const templateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  tags: z.array(z.string()),
  status: z.enum(['draft', 'active', 'archived']),
});

type TemplateFormData = z.infer<typeof templateSchema>;

interface Props {
  initialData?: Partial<TemplateFormData>;
  onSave: (data: TemplateFormData) => Promise<void>;
  onCancel?: () => void;
}

export function TemplateForm({ initialData, onSave, onCancel }: Props) {
  const [showBlueprintModal, setShowBlueprintModal] = React.useState(false);
  const [showDesignUploader, setShowDesignUploader] = React.useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting, isDirty } } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: initialData
  });

  const selectedBlueprints = watch('blueprints');
  const selectedDesigns = watch('designs');

  const handleBlueprintSelect = (blueprints: Blueprint[]) => {
    const existingIds = new Set(selectedBlueprints.map(b => b.id));
    const newBlueprints = blueprints.filter(b => !existingIds.has(b.id));
    
    setValue('blueprints', [...selectedBlueprints, ...newBlueprints], {
      shouldDirty: true
    });
    setShowBlueprintModal(false);
  };

  const handleBlueprintRemove = (blueprintId: string) => {
    setValue(
      'blueprints',
      selectedBlueprints.filter(b => b.id !== blueprintId),
      { shouldDirty: true }
    );
  };

  const handleDesignUpload = async (designs: Partial<TemplateDesign>[]) => {
    setValue('designs', [...selectedDesigns, ...designs], {
      shouldDirty: true
    });
    setShowDesignUploader(false);
  };

  const handleDesignRemove = (designId: string) => {
    setValue(
      'designs',
      selectedDesigns.filter(d => d.id !== designId),
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
            {...register('title')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
          <h3 className="text-lg font-medium text-gray-900">Designs</h3>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {selectedDesigns.map((design) => (
              <div
                key={design.id}
                className="relative group aspect-w-1 aspect-h-1 rounded-lg bg-gray-100 overflow-hidden"
              >
                {design.thumbnailUrl && (
                  <img
                    src={design.thumbnailUrl}
                    alt={design.name}
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleDesignRemove(design.id)}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => setShowDesignUploader(true)}
              className="flex flex-col items-center justify-center aspect-w-1 aspect-h-1 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400"
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-500">Add Designs</span>
            </button>
          </div>
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
                  onClick={() => handleBlueprintRemove(blueprint.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setShowBlueprintModal(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Blueprint
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Template'}
        </button>
      </div>

      <BlueprintSelectorModal
        isOpen={showBlueprintModal}
        onClose={() => setShowBlueprintModal(false)}
        onSelect={handleBlueprintSelect}
        selectedBlueprints={selectedBlueprints}
      />

      <DesignUploader
        isOpen={showDesignUploader}
        onClose={() => setShowDesignUploader(false)}
        onUploadComplete={handleDesignUpload}
        allowedTypes={['image/jpeg', 'image/png']}
        maxFileSize={5 * 1024 * 1024} // 5MB
      />
    </form>
  );
}