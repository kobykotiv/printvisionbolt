import React, { useState } from 'react';
import { CollectionsGrid } from '../components/collections/CollectionsGrid';
import { CollectionForm } from '../components/collections/CollectionForm';
import { useCollections } from '../hooks/useCollections';
import { Modal } from '../components/ui/Modal'; // Assume a Modal UI component exists

export function CollectionsPage() {
  const { collections, createCollection, updateCollection, deleteCollections } = useCollections();
  const [editingCollection, setEditingCollection] = useState<null | any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = () => {
    setEditingCollection(null);
    setIsModalOpen(true);
  };

  const handleEdit = (collection: any) => {
    setEditingCollection(collection);
    setIsModalOpen(true);
  };

  const handleSave = async (data: any) => {
    if (editingCollection) {
      await updateCollection(editingCollection.id, data);
    } else {
      await createCollection(data);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Collections</h1>
      <CollectionsGrid
        collections={collections}
        onEdit={handleEdit}
        onDelete={deleteCollections}
        onCreate={handleCreate}
      />

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <CollectionForm
            initialData={editingCollection || undefined}
            onSave={handleSave}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
