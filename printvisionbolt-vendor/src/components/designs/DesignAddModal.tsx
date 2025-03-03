import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Design } from '../../lib/types/design';
import { CollectionService } from '../../lib/services/CollectionService';
import './DesignAddModal.css';

interface DesignAddModalProps {
  collectionId: string;
  onClose: () => void;
}

const collectionService = new CollectionService();

export function DesignAddModal({ collectionId, onClose }: DesignAddModalProps) {
  const [selectedDesigns, setSelectedDesigns] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const { data: designs = [], isLoading } = useQuery({
    queryKey: ['available-designs', collectionId],
    queryFn: () => collectionService.getAvailableDesigns(collectionId)
  });

  const addDesignsMutation = useMutation({
    mutationFn: (designIds: string[]) => 
      collectionService.addDesignsToCollection(collectionId, designIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collection', collectionId] });
      onClose();
    }
  });

  const toggleDesign = (designId: string) => {
    const newSelected = new Set(selectedDesigns);
    if (newSelected.has(designId)) {
      newSelected.delete(designId);
    } else {
      newSelected.add(designId);
    }
    setSelectedDesigns(newSelected);
  };

  const handleAdd = () => {
    if (selectedDesigns.size > 0) {
      addDesignsMutation.mutate(Array.from(selectedDesigns));
    }
  };

  return (
    <div className="design-add-modal-overlay">
      <div className="design-add-modal">
        <div className="modal-header">
          <h2>Add Designs to Collection</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Loading designs...</p>
            </div>
          ) : designs.length === 0 ? (
            <div className="empty-state">
              <p>No available designs to add.</p>
            </div>
          ) : (
            <div className="design-grid">
              {designs.map((design: Design) => (
                <div
                  key={design.id}
                  className={`design-item ${selectedDesigns.has(design.id) ? 'selected' : ''}`}
                  onClick={() => toggleDesign(design.id)}
                >
                  <img
                    src={design.thumbnailUrl}
                    alt={design.name}
                    className="design-thumbnail"
                  />
                  <div className="design-info">
                    <span className="design-name">{design.name}</span>
                    <span className="design-category">{design.category}</span>
                  </div>
                  <div className="selection-indicator" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button
            className="primary-button"
            disabled={selectedDesigns.size === 0 || addDesignsMutation.isPending}
            onClick={handleAdd}
          >
            {addDesignsMutation.isPending
              ? 'Adding...'
              : `Add ${selectedDesigns.size} Design${selectedDesigns.size !== 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}