import React from 'react';
import { useForm } from 'react-hook-form';
import { Save } from 'lucide-react';
import { Modal } from './Modal';
import type { Blueprint } from '../../lib/types/template';

interface ProductFormData {
  title: string;
  description: string;
  blueprint: string;
  price: number;
  status: 'draft' | 'active';
}

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData) => Promise<void>;
  blueprints: Blueprint[];
}

export function NewProductModal({ isOpen, onClose, onSave, blueprints }: NewProductModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProductFormData>();

  const onSubmit = async (data: ProductFormData) => {
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Product">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
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
          <label className="block text-sm font-medium text-gray-700">Blueprint</label>
          <select
            {...register('blueprint', { required: 'Blueprint is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select a blueprint</option>
            {blueprints.map((blueprint) => (
              <option key={blueprint.id} value={blueprint.id}>
                {blueprint.title}
              </option>
            ))}
          </select>
          {errors.blueprint && (
            <p className="mt-1 text-sm text-red-600">{errors.blueprint.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              {...register('price', {
                required: 'Price is required',
                min: { value: 0, message: 'Price must be positive' }
              })}
              className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            {...register('status')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
          </select>
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
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </Modal>
  );
}