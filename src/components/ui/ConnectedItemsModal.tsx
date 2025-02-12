import React from 'react';
import { Dialog } from '@headlessui/react';
import { X, FileSpreadsheet, Palette, ExternalLink } from 'lucide-react';
import type { Design } from '../../lib/types/design';
import type { Template } from '../../lib/types/template';

interface ConnectedItem {
  id: string;
  title: string;
  thumbnail?: string;
  description?: string;
  tags: string[];
  status: string;
  type: 'design' | 'template';
}

interface ConnectedItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: Array<Design | Template>;
  type: 'design' | 'template';
  onItemClick?: (item: Design | Template) => void;
}

export function ConnectedItemsModal({
  isOpen,
  onClose,
  title,
  items,
  type,
  onItemClick,
}: ConnectedItemsModalProps) {
  const formatConnectedItem = (item: Design | Template): ConnectedItem => {
    if (type === 'design') {
      const design = item as Design;
      return {
        id: design.id,
        title: design.name,
        thumbnail: design.thumbnailUrl,
        description: design.description,
        tags: design.tags,
        status: design.status,
        type: 'design'
      };
    } else {
      const template = item as Template;
      return {
        id: template.id,
        title: template.title,
        description: template.description,
        tags: template.tags,
        status: template.status,
        type: 'template'
      };
    }
  };

  const formattedItems = items.map(formatConnectedItem);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto p-4 pt-[10vh]"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="relative mx-auto max-w-4xl bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {formattedItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                {type === 'design' ? <Palette /> : <FileSpreadsheet />}
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No {type}s found</h3>
              <p className="mt-1 text-sm text-gray-500">
                There are no {type}s connected to this item yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {formattedItems.map((item) => (
                <div
                  key={item.id}
                  className="relative group bg-white rounded-lg border hover:border-indigo-500 transition-colors"
                >
                  {item.thumbnail && (
                    <div className="aspect-w-4 aspect-h-3">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                      {onItemClick && (
                        <button
                          onClick={() => onItemClick(items.find(i => i.id === item.id)!)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="View details"
                        >
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                        </button>
                      )}
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : item.status === 'archived'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-4 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
  );
}