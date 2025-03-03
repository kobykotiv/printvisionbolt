import { useState, useCallback } from 'react';
import { Design } from '../types/content';

export function useDesigns() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDesign = useCallback(async (data: Omit<Design, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      // API call simulation
      const newDesign: Design = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setDesigns(prev => [...prev, newDesign]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create design');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateDesign = useCallback(async (id: string, data: Partial<Design>) => {
    setIsLoading(true);
    try {
      setDesigns(prev =>
        prev.map(design =>
          design.id === id ? { ...design, ...data, updatedAt: new Date() } : design
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update design');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteDesigns = useCallback(async (ids: string[]) => {
    setIsLoading(true);
    try {
      setDesigns(prev => prev.filter(design => !ids.includes(design.id)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete designs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const bulkAddToCollection = useCallback(async (ids: string[]) => {
    // Implement the bulk add logic (e.g., open a modal to choose collection)
    console.log('Bulk add designs', ids);
  }, []);

  return {
    designs,
    isLoading,
    error,
    createDesign,
    updateDesign,
    deleteDesigns,
    bulkAddToCollection
  };
}