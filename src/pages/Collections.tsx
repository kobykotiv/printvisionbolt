import React, { useState, useCallback } from 'react';
import CollectionTree from '../components/collections/CollectionTree';
import { CollectionService } from '../lib/services/CollectionService';
import { CollectionHierarchyNode, CollectionMove } from '../lib/types/collection';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import './Collections.css';

const collectionService = new CollectionService();

export default function Collections() {
  const [selectedId, setSelectedId] = useState<string>();
  const queryClient = useQueryClient();

  const { data: collections = [], isLoading, error } = useQuery({
    queryKey: ['collections-hierarchy'],
    queryFn: () => collectionService.getCollectionHierarchy()
  });

  const moveMutation = useMutation({
    mutationFn: (move: CollectionMove) => collectionService.moveCollection(move),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections-hierarchy'] });
    }
  });

  const handleSelect = useCallback((collection: CollectionHierarchyNode) => {
    setSelectedId(collection.id);
  }, []);

  const handleMove = useCallback(async (move: CollectionMove) => {
    try {
      await moveMutation.mutateAsync(move);
    } catch (error) {
      console.error('Failed to move collection:', error);
      // TODO: Show error notification using your preferred notification system
      
    }
  }, [moveMutation]);

  if (error) {
    return (
      <div className="error-state">
        <h2>Error Loading Collections</h2>
        <p>{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
        <button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['collections-hierarchy'] })}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="collections-page">
      <h1>Collections</h1>
      <div className="collections-container">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Loading collections...</p>
          </div>
        ) : (
          <CollectionTree
            collections={collections}
            selectedId={selectedId}
            enableDragDrop={true}
            showDesignCount={true}
            showInheritedDesigns={true}
            onSelect={handleSelect}
            onMove={handleMove}
            className="collections-tree"
          />
        )}
      </div>
    </div>
  );
}
