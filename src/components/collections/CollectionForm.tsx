import React, { useState, useEffect } from 'react';
import { Collection, CollectionRule } from '../../types/content';
import Button from '../ui/Button';

interface CollectionFormProps {
  initialData?: Collection;
  onSave: (data: Omit<Collection, 'id' | 'createdAt' | 'updatedAt' | 'itemCount'>) => void;
  onCancel: () => void;
}

export function CollectionForm({ initialData, onSave, onCancel }: CollectionFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isSmartCollection, setIsSmartCollection] = useState(initialData?.isSmartCollection || false);
  const [rules, setRules] = useState<CollectionRule[]>(initialData?.rules || []);

  const handleSave = () => {
    onSave({ name, description, isSmartCollection, rules });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Smart Collection</label>
        <input
          type="checkbox"
          checked={isSmartCollection}
          onChange={(e) => setIsSmartCollection(e.target.checked)}
          className="mt-1"
        />
      </div>
      {isSmartCollection && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Rules</label>
          {/* Add UI for managing rules */}
        </div>
      )}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
}
