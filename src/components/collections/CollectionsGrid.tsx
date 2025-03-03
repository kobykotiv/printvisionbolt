import React, { useState } from 'react';
import { FolderTree, MoreVertical, Plus } from 'lucide-react';
import { Collection } from '../../types/content';
import Button from '../ui/Button';
import { Card } from '../ui/Card';

interface CollectionsGridProps {
  collections: Collection[];
  onEdit: (collection: Collection) => void;
  onDelete: (ids: string[]) => void;
  onCreate: () => void;
}

export function CollectionsGrid({ collections, onEdit, onDelete, onCreate }: CollectionsGridProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedIds.length} collections?`)) {
      onDelete(selectedIds);
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {selectedIds.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleBulkDelete}
              className="text-red-600 border-red-600"
            >
              Delete Selected ({selectedIds.length})
            </Button>
          )}
        </div>
        <Button onClick={onCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New Collection
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((collection) => (
          <Card
            key={collection.id}
            className={`
              relative p-4 cursor-pointer transition-all
              ${selectedIds.includes(collection.id) ? 'ring-2 ring-blue-500' : ''}
            `}
            onClick={() => toggleSelection(collection.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <FolderTree className="h-8 w-8 text-blue-500" />
                <div>
                  <h3 className="font-medium">{collection.name}</h3>
                  <p className="text-sm text-gray-500">
                    {collection.itemCount} items
                    {collection.isSmartCollection && ' • Smart Collection'}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(collection);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
