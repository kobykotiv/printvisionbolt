import React from 'react';
import { useForm } from 'react-hook-form';
import { Upload, Tag, Plus, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import type { BulkUploadConfig } from '../../lib/types/bulk-upload';
import type { Template } from '../../lib/types/template';

interface BulkUploadFormProps {
  onSubmit: (config: BulkUploadConfig, files: File[]) => Promise<void>;
  templates?: Template[];
  isSubmitting?: boolean;
}

export function BulkUploadForm({
  onSubmit,
  templates = [],
  isSubmitting
}: BulkUploadFormProps) {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [tagInput, setTagInput] = React.useState('');
  const { register, handleSubmit, watch, setValue } = useForm<BulkUploadConfig>({
    defaultValues: {
      providers: ['printify'],
      metadata: {
        tags: []
      }
    }
  });

  const tags = watch('metadata.tags') || [];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg']
    },
    maxSize: 50 * 1024 * 1024,
    onDrop: (acceptedFiles) => {
      setSelectedFiles(prev => [...prev, ...acceptedFiles]);
    }
  });

  const handleTagAdd = () => {
    if (tagInput.trim()) {
      const newTags = [...tags, ...tagInput.split(',').map(t => t.trim())];
      setValue('metadata.tags', Array.from(new Set(newTags)));
      setTagInput('');
    }
  };

  const handleTagRemove = (tag: string) => {
    setValue('metadata.tags', tags.filter(t => t !== tag));
  };

  const handleFormSubmit = async (data: BulkUploadConfig) => {
    if (selectedFiles.length === 0) return;
    await onSubmit(data, selectedFiles);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Name
          </label>
          <input
            type="text"
            {...register('name', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            {...register('metadata.category')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <div className="mt-1 flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
              placeholder="Add tags (comma-separated)"
              className="block flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleTagAdd}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-indigo-100 text-indigo-700"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="ml-1 hover:text-indigo-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {templates.length > 0 && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Template
            </label>
            <select
              {...register('metadata.template')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">None</option>
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div
        {...getRootProps()}
        className={`mt-6 border-2 border-dashed rounded-lg p-12 text-center ${
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop your design files here, or click to select files
        </p>
        <p className="mt-1 text-xs text-gray-500">
          PNG, JPG, SVG up to 50MB
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Selected Files ({selectedFiles.length})
          </h3>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-900">
                    {file.name}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || selectedFiles.length === 0}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Uploading...' : 'Start Upload'}
        </button>
      </div>
    </form>
  );
}