import { useCallback, useState } from 'react';
import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  UseQueryOptions
} from '@tanstack/react-query';
import { designsAPI, Design, CreateDesign, UpdateDesign, DesignQueryParams, DesignResponse } from '../lib/api/designs';
import { APIRequestError } from '../lib/api/client';
import { useAuth } from '../contexts/auth/AuthContext';

type DesignsQueryKey = ['designs', DesignQueryParams];

/**
 * Custom hook for managing designs data and operations
 */
export function useDesigns(params: DesignQueryParams = {}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const queryKey: DesignsQueryKey = ['designs', params];

  // Fetch designs with React Query
  const queryOptions: UseQueryOptions<DesignResponse, APIRequestError, DesignResponse, DesignsQueryKey> = {
    queryKey,
    queryFn: () => designsAPI.getDesigns(params),
    enabled: !!user
  };

  const query = useQuery(queryOptions);

  // Handle query errors
  useCallback((err: APIRequestError) => {
    setError(err.error.message);
  }, []);

  const invalidateDesigns = useCallback(() => {
    return queryClient.invalidateQueries({
      queryKey: ['designs']
    });
  }, [queryClient]);

  // Create design mutation
  const createMutation = useMutation<Design, APIRequestError, CreateDesign>({
    mutationFn: (newDesign) => designsAPI.createDesign(newDesign),
    onSuccess: () => {
      invalidateDesigns();
      setError(null);
    },
    onError: (err: APIRequestError) => setError(err.error.message)
  });

  // Update design mutation
  const updateMutation = useMutation<Design, APIRequestError, { id: string; updates: UpdateDesign }>({
    mutationFn: ({ id, updates }) => designsAPI.updateDesign(id, updates),
    onSuccess: () => {
      invalidateDesigns();
      setError(null);
    },
    onError: (err: APIRequestError) => setError(err.error.message)
  });

  // Delete design mutation
  const deleteMutation = useMutation<void, APIRequestError, string>({
    mutationFn: (id) => designsAPI.deleteDesign(id),
    onSuccess: () => {
      invalidateDesigns();
      setError(null);
    },
    onError: (err: APIRequestError) => setError(err.error.message)
  });

  // Upload design file
  const uploadMutation = useMutation<
    { file_url: string; thumbnail_url?: string },
    APIRequestError,
    File
  >({
    mutationFn: (file) => designsAPI.uploadDesignFile(file),
    onError: (err: APIRequestError) => setError(err.error.message)
  });

  // Bulk create designs
  const bulkCreateMutation = useMutation<
    { successful: Design[]; failed: Array<{ design: CreateDesign; error: string }> },
    APIRequestError,
    CreateDesign[]
  >({
    mutationFn: (designs) => designsAPI.bulkCreateDesigns(designs),
    onSuccess: () => {
      invalidateDesigns();
      setError(null);
    },
    onError: (err: APIRequestError) => setError(err.error.message)
  });

  // Tag management
  const addTags = useCallback(
    async (designId: string, tags: string[]) => {
      try {
        await designsAPI.addTags(designId, tags);
        await invalidateDesigns();
        setError(null);
      } catch (err) {
        if (err instanceof APIRequestError) {
          setError(err.error.message);
        }
      }
    },
    [invalidateDesigns]
  );

  const removeTags = useCallback(
    async (designId: string, tags: string[]) => {
      try {
        await designsAPI.removeTags(designId, tags);
        await invalidateDesigns();
        setError(null);
      } catch (err) {
        if (err instanceof APIRequestError) {
          setError(err.error.message);
        }
      }
    },
    [invalidateDesigns]
  );

  // Clear any error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const designsData = query.data as DesignResponse | undefined;

  return {
    designs: designsData?.data ?? [],
    pagination: designsData ? {
      total: designsData.total,
      page: designsData.page,
      limit: designsData.limit
    } : undefined,
    
    isLoading: query.isPending,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isUploading: uploadMutation.isPending,
    isBulkCreating: bulkCreateMutation.isPending,
    
    error,
    clearError,
    
    createDesign: createMutation.mutate,
    updateDesign: updateMutation.mutate,
    deleteDesign: deleteMutation.mutate,
    uploadFile: uploadMutation.mutate,
    bulkCreateDesigns: bulkCreateMutation.mutate,
    addTags,
    removeTags,
    refetch: query.refetch,
  } as const;
}

// Export types for components
export type { Design, CreateDesign, UpdateDesign, DesignQueryParams };