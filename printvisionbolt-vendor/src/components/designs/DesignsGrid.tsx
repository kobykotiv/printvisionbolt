import React, { useState } from 'react';
import { Image, MoreVertical, Plus, Upload } from 'lucide-react';
import { Design } from '../../types/content';
import Button from '../ui/Button';
import { Card } from '../ui/Card';

interface DesignsGridProps {
  designs: Design[];
  onEdit: (design: Design) => void;
  onDelete: (ids: string[]) => void;
  onUpload: () => void;
  onBulkAddToCollection: (ids: string[]) => void;
}

export function DesignsGrid({ 
  designs, 
  onEdit, 
  onDelete, 
  onUpload,
  onBulkAddToCollection 
}: DesignsGridProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedIds.length} designs?`)) {
      onDelete(selectedIds);
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {selectedIds.length > 0 && (
            <>
              <Button 
                variant="outline" 
                onClick={handleBulkDelete}
                className="text-red-600 border-red-600"
              >
                Delete Selected ({selectedIds.length})
              </Button>
              <Button 
                variant="outline"
                onClick={() => onBulkAddToCollection(selectedIds)}
              >
                Add to Collection
              </Button>
            </>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onUpload}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Designs
          </Button>
          <Button onClick={() => onEdit({ id: 'new' } as Design)}>
            <Plus className="h-4 w-4 mr-2" />
            New Design
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {designs.map((design) => (
          <Card
            key={design.id}
            className={`
              relative p-4 cursor-pointer transition-all
              ${selectedIds.includes(design.id) ? 'ring-2 ring-blue-500' : ''}
            `}
            onClick={() => toggleSelection(design.id)}
          >
            <div className="aspect-square mb-2 relative rounded-lg overflow-hidden bg-gray-100">
              {design.imageUrl ? (
                <img 
                  src={design.imageUrl} 
                  alt={design.title}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <Image className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium truncate">{design.title}</h3>
                <p className="text-sm text-gray-500">
                  {design.tags.length} tags
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(design);
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
