import { useState, useCallback } from 'react';
import { Collection, CollectionRule } from '../types/content';

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCollection = useCallback(async (
    data: Omit<Collection, 'id' | 'createdAt' | 'updatedAt' | 'itemCount'>
  ) => {
    setIsLoading(true);
    try {
      // API call would go here
      const newCollection: Collection = {
        ...data,
        id: Date.now().toString(),
        itemCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setCollections(prev => [...prev, newCollection]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create collection');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCollection = useCallback(async (
    id: string,
    data: Partial<Collection>
  ) => {
    setIsLoading(true);
    try {
      // API call would go here
      setCollections(prev => 
        prev.map(collection => 
          collection.id === id 
            ? { ...collection, ...data, updatedAt: new Date() }
            : collection
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update collection');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteCollections = useCallback(async (ids: string[]) => {
    setIsLoading(true);
    try {
      // API call would go here
      setCollections(prev => 
        prev.filter(collection => !ids.includes(collection.id))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete collections');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    collections,
    isLoading,
    error,
    createCollection,
    updateCollection,
    deleteCollections
  };
}
