import React from 'react';
import { Dialog } from '@headlessui/react';
import { X, Save, Link } from 'lucide-react';
import { Design } from '../../lib/types/design';
import type { Template } from '../../lib/types/template';
import { ConnectedItemsModal } from '../ui/ConnectedItemsModal';

interface EditDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  design: Design;
  onSave: (updatedDesign: Design) => Promise<void>;
  connectedTemplates: Template[];
}

export function EditDesignModal({
  isOpen,
  onClose,
  design,
  onSave,
  connectedTemplates,
}: EditDesignModalProps) {
  const [formData, setFormData] = React.useState<Design>(design);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showConnectedModal, setShowConnectedModal] = React.useState(false);

  React.useEffect(() => {
    setFormData(design);
  }, [design]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving design:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map((tag) => tag.trim());
    setFormData((prev) => ({
      ...prev,
      tags,
    }));
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto p-4 pt-[10vh]"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="relative mx-auto max-w-4xl bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Edit Design</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6 p-6">
            {/* Left column - Design details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags.join(', ')}
                  onChange={handleTagsChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Right column - Preview and metadata */}
            <div className="space-y-4">
              <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={formData.thumbnailUrl}
                  alt={formData.name}
                  className="object-cover"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Metadata</h3>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <dt className="text-gray-500">Dimensions</dt>
                  <dd className="text-gray-900">
                    {formData.metadata.width} x {formData.metadata.height}px
                  </dd>
                  <dt className="text-gray-500">Format</dt>
                  <dd className="text-gray-900">{formData.metadata.format}</dd>
                  <dt className="text-gray-500">DPI</dt>
                  <dd className="text-gray-900">{formData.metadata.dpi}</dd>
                  <dt className="text-gray-500">Color Space</dt>
                  <dd className="text-gray-900">{formData.metadata.colorSpace}</dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Connected Templates Section */}
          <div className="border-t p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">
                Connected Templates ({connectedTemplates.length})
              </h3>
              <button
                type="button"
                onClick={() => setShowConnectedModal(true)}
                className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
              >
                <Link className="h-4 w-4 mr-1" />
                View Connections
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-4 p-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md border"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSaving ? (
                'Saving...'
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>

        <ConnectedItemsModal
          isOpen={showConnectedModal}
          onClose={() => setShowConnectedModal(false)}
          title="Connected Templates"
          items={connectedTemplates}
          type="template"
        />
      </div>
    </Dialog>
  );
}