import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { designsAPI, designKeys, type Design, type DesignFilters, type DesignListResponse } from '../lib/api/designs';
import type { APIError } from '../lib/api/client';

// List designs hook
export function useDesignsList(
  filters?: DesignFilters,
  options?: Omit<UseQueryOptions<DesignListResponse, APIError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: designKeys.list(filters ?? {}),
    queryFn: () => designsAPI.list(filters),
    ...options,
  });
}

// Get single design hook
export function useDesign(
  id: string,
  options?: Omit<UseQueryOptions<Design, APIError>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: designKeys.detail(id),
    queryFn: () => designsAPI.getById(id),
    ...options,
  });
}

// Create design hook
export function useCreateDesign(
  options?: Omit<UseMutationOptions<Design, APIError, Omit<Design, 'id' | 'created_at' | 'updated_at'>>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: designsAPI.create.bind(designsAPI),
    onSuccess: (newDesign) => {
      queryClient.invalidateQueries({ queryKey: designKeys.lists() });
      queryClient.setQueryData(designKeys.detail(newDesign.id), newDesign);
    },
    ...options,
  });
}

// Update design hook
export function useUpdateDesign(
  options?: Omit<UseMutationOptions<Design, APIError, { id: string; data: Partial<Design> }>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => designsAPI.update(id, data),
    onSuccess: (updatedDesign) => {
      queryClient.invalidateQueries({ queryKey: designKeys.lists() });
      queryClient.setQueryData(designKeys.detail(updatedDesign.id), updatedDesign);
    },
    ...options,
  });
}

// Delete design hook
export function useDeleteDesign(
  options?: Omit<UseMutationOptions<void, APIError, string>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: designsAPI.delete.bind(designsAPI),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: designKeys.lists() });
      queryClient.removeQueries({ queryKey: designKeys.detail(deletedId) });
    },
    ...options,
  });
}

// Bulk update designs hook
export function useBulkUpdateDesigns(
  options?: Omit<UseMutationOptions<Design[], APIError, { ids: string[]; data: Partial<Design> }>, 'mutationFn'>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, data }) => designsAPI.bulkUpdate(ids, data),
    onSuccess: (updatedDesigns) => {
      queryClient.invalidateQueries({ queryKey: designKeys.lists() });
      updatedDesigns.forEach((design) => {
        queryClient.setQueryData(designKeys.detail(design.id), design);
      });
    },
    ...options,
  });
}

// Extract colors hook
export function useExtractColors(
  options?: Omit<UseMutationOptions<string[], APIError, string>, 'mutationFn'>
) {
  return useMutation({
    mutationFn: designsAPI.extractColors.bind(designsAPI),
    ...options,
  });
}