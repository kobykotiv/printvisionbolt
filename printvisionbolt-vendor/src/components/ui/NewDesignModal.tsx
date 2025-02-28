import React from 'react';
import { useForm } from 'react-hook-form';
import { Save } from 'lucide-react';
import { Modal } from './Modal';
import { DesignUploader } from '../designs/DesignUploader';
import type { Design } from '../../lib/types/design';

interface DesignFormData {
  title: string;
  description: string;
  tags: string[];
}

interface NewDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DesignFormData, files: File[]) => Promise<void>;
}

export function NewDesignModal({ isOpen, onClose, onSave }: NewDesignModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<DesignFormData>();
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);

  const handleUpload = (files: File[]) => {
    setSelectedFiles(files);
  };

  const onSubmit = async (data: DesignFormData) => {
    if (selectedFiles.length === 0) {
      return;
    }

    try {
      await onSave(data, selectedFiles);
      onClose();
    } catch (error) {
      console.error('Error saving design:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload New Design">
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
          <label className="block text-sm font-medium text-gray-700">Tags</label>
          <input
            type="text"
            {...register('tags')}
            placeholder="Enter tags separated by commas"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Files</label>
          <DesignUploader onUpload={handleUpload} />
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
            disabled={isSubmitting || selectedFiles.length === 0}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Upload Design'}
          </button>
        </div>
      </form>
    </Modal>
  );
}