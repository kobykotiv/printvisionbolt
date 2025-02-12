import React from 'react';
import { useForm } from 'react-hook-form';
import { Palette } from 'lucide-react';
import type { Brand } from '../../lib/types/brand';

interface BrandFormProps {
  brand?: Brand;
  onSubmit: (data: Brand) => Promise<void>;
  isSubmitting?: boolean;
}

export function BrandForm({ brand, onSubmit, isSubmitting }: BrandFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Brand>({
    defaultValues: brand || {
      name: '',
      description: '',
      logo_url: '',
      color_scheme: {
        primary: '#6366F1',
        secondary: '#8B5CF6'
      }
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          {...register('name', { required: 'Brand name is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Logo URL
        </label>
        <input
          type="url"
          {...register('logo_url')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Color Scheme
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500">Primary Color</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="color"
                {...register('color_scheme.primary')}
                className="h-8 w-8 rounded border border-gray-300"
              />
              <input
                type="text"
                {...register('color_scheme.primary')}
                className="block flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500">Secondary Color</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="color"
                {...register('color_scheme.secondary')}
                className="h-8 w-8 rounded border border-gray-300"
              />
              <input
                type="text"
                {...register('color_scheme.secondary')}
                className="block flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <Palette className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Saving...' : brand ? 'Update Brand' : 'Create Brand'}
        </button>
      </div>
    </form>
  );
}