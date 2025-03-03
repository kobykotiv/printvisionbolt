import React from 'react';
import { useForm } from 'react-hook-form';
import { Search, Save } from 'lucide-react';
import { Modal } from './Modal';
import type { Blueprint } from '../../lib/types/template';

interface CollectionFormData {
  name: string;
  description: string;
  blueprints: string[];
}

interface NewCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CollectionFormData) => Promise<void>;
  availableBlueprints: Blueprint[];
}

export function NewCollectionModal({
  isOpen,
  onClose,
  onSave,
  availableBlueprints
}: NewCollectionModalProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<CollectionFormData>();
  const [searchQuery, setSearchQuery] = React.useState('');
  const selectedBlueprints = watch('blueprints') || [];

  const filteredBlueprints = availableBlueprints.filter(blueprint =>
    blueprint.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleBlueprint = (blueprintId: string) => {
    const current = selectedBlueprints;
    const updated = current.includes(blueprintId)
      ? current.filter(id => id !== blueprintId)
      : [...current, blueprintId];
    setValue('blueprints', updated, { shouldValidate: true });
  };

  const onSubmit = async (data: CollectionFormData) => {
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Error saving collection:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Collection">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            {...register('name', { required: 'Collection name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Blueprints</label>
          <div className="mt-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blueprints..."
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 max-h-60 overflow-y-auto">
            {filteredBlueprints.map((blueprint) => (
              <label
                key={blueprint.id}
                className="relative flex items-start py-3 px-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <div className="min-w-0 flex-1 text-sm">
                  <div className="font-medium text-gray-700">{blueprint.title}</div>
                  <p className="text-gray-500">{blueprint.provider}</p>
                </div>
                <div className="ml-3 flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={selectedBlueprints.includes(blueprint.id)}
                    onChange={() => toggleBlueprint(blueprint.id)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Create Collection'}
          </button>
        </div>
      </form>
    </Modal>
  );
}