import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CollectionService } from '../lib/services/CollectionService';
import { CollectionMove } from '../lib/types/collection';
import { Design } from '../lib/types/design';
import CollectionTree from '../components/collections/CollectionTree';
import { DesignAddModal } from '../components/designs/DesignAddModal';
import { CollectionEditModal } from '../components/collections/CollectionEditModal';
import './CollectionDetails.css';

const collectionService = new CollectionService();

export function CollectionDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [designToRemove, setDesignToRemove] = useState<string | null>(null);

  const { data: collection, isLoading, error } = useQuery({
    queryKey: ['collection', id],
    queryFn: () => collectionService.getCollection(id!, true),
    enabled: !!id
  });

  const { data: hierarchy = [] } = useQuery({
    queryKey: ['collections-hierarchy'],
    queryFn: () => collectionService.getCollectionHierarchy()
  });

  const moveMutation = useMutation({
    mutationFn: collectionService.moveCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections-hierarchy'] });
      queryClient.invalidateQueries({ queryKey: ['collection', id] });
    }
  });

  const removeDesignMutation = useMutation({
    mutationFn: async (designId: string) => {
      await collectionService.batchDesignOperation({
        operation: 'move',
        designIds: [designId],
        targetCollectionId: null
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection', id] });
      setDesignToRemove(null);
    }
  });

  const handleMove = async (move: CollectionMove) => {
    await moveMutation.mutateAsync(move);
  };

  const handleDelete = () => {
    navigate('/app/collections');
  };

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner" />
        <p>Loading collection details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <h2>Error Loading Collection</h2>
        <p>{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
        <button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['collection', id] })}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="error-state">
        <h2>Collection Not Found</h2>
        <p>The requested collection could not be found.</p>
        <button 
          onClick={() => navigate('/app/collections')}
          className="retry-button"
        >
          Back to Collections
        </button>
      </div>
    );
  }

  return (
    <div className="collection-details-page">
      <div className="page-header">
        <h1>{collection.name}</h1>
        <div className="page-actions">
          <button
            className="secondary-button"
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit Collection
          </button>
          <button 
            onClick={() => navigate('/app/collections')}
            className="secondary-button"
          >
            Back
          </button>
        </div>
      </div>

      <div className="content-layout">
        {/* Collection Tree */}
        <div className="tree-container">
          <CollectionTree
            collections={hierarchy}
            selectedId={collection.id}
            enableDragDrop={true}
            showDesignCount={true}
            showInheritedDesigns={true}
            onSelect={(selected) => {
              if (selected.id !== collection.id) {
                navigate(`/app/collections/${selected.id}`);
              }
            }}
            onMove={handleMove}
          />
        </div>

        {/* Collection Content */}
        <div className="main-content">
          {/* Design Grid */}
          <div className="designs-container">
            <div className="designs-header">
              <h2>Designs</h2>
              <div className="designs-actions">
                <button 
                  className="primary-button"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  Add Designs
                </button>
              </div>
            </div>

            {collection.designs.length === 0 ? (
              <div className="empty-state">
                <p>No designs in this collection yet.</p>
                <button 
                  className="link-button"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  Add your first design
                </button>
              </div>
            ) : (
              <div className="design-grid">
                {collection.designs.map((design: Design) => (
                  <div 
                    key={design.id}
                    className="design-item"
                  >
                    <img 
                      src={design.thumbnailUrl}
                      alt={design.name}
                      className="design-thumbnail"
                    />
                    <button
                      className="remove-design"
                      onClick={() => setDesignToRemove(design.id)}
                      title="Remove from collection"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <DesignAddModal
          collectionId={collection.id}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {isEditModalOpen && (
        <CollectionEditModal
          collectionId={collection.id}
          initialName={collection.name}
          onClose={() => setIsEditModalOpen(false)}
          onDelete={handleDelete}
        />
      )}

      {designToRemove && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Remove Design</h2>
              <button 
                className="close-button"
                onClick={() => setDesignToRemove(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to remove this design from the collection?</p>
            </div>
            <div className="modal-footer">
              <button
                className="secondary-button"
                onClick={() => setDesignToRemove(null)}
              >
                Cancel
              </button>
              <button
                className="danger-button"
                onClick={() => removeDesignMutation.mutate(designToRemove)}
                disabled={removeDesignMutation.isPending}
              >
                {removeDesignMutation.isPending ? 'Removing...' : 'Remove Design'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
