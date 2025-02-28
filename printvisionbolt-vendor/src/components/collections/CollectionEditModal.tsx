import React, { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { CollectionService } from '../../lib/services/CollectionService';
import './CollectionEditModal.css';

interface CollectionEditModalProps {
  collectionId: string;
  initialName: string;
  onClose: () => void;
  onDelete?: () => void;
}

const collectionService = new CollectionService();

export function CollectionEditModal({
  collectionId,
  initialName,
  onClose,
  onDelete
}: CollectionEditModalProps) {
  const [name, setName] = useState(initialName);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async () => {
      await collectionService.updateCollection(collectionId, { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection', collectionId] });
      queryClient.invalidateQueries({ queryKey: ['collections-hierarchy'] });
      onClose();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await collectionService.batchOperation({
        operation: 'delete',
        collectionIds: [collectionId]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections-hierarchy'] });
      onDelete?.();
      onClose();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {!showDeleteConfirm ? (
          <>
            <div className="modal-header">
              <h2>Edit Collection</h2>
              <button className="close-button" onClick={onClose}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="collection-name">Collection Name</label>
                  <input
                    id="collection-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="danger-button"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete Collection
                </button>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="primary-button"
                    disabled={updateMutation.isPending || name === initialName}
                  >
                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="modal-header">
              <h2>Delete Collection</h2>
              <button className="close-button" onClick={onClose}>×</button>
            </div>
            <div className="modal-body">
              <p className="confirmation-message">
                Are you sure you want to delete this collection? This action cannot be undone.
              </p>
              <p className="warning-message">
                All designs within this collection will be moved to the root level.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="secondary-button"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="danger-button"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Collection'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}