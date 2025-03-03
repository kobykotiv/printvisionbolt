import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from './wrapper';
import { useProducts, useOrders, useSession } from '../src/hooks';
import { mockProducts, mockOrders, mockSession, createMockRouter } from './utils';

describe('API Client Integration', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  beforeEach(() => {
    const mockRouter = createMockRouter();
    wrapper = createWrapper(mockRouter);
  });

  describe('useProducts', () => {
    it('should fetch products successfully', async () => {
      const { result } = renderHook(() => useProducts('store-1'), { wrapper });

      // Initially loading
      expect(result.current.isLoading).toBe(true);

      // Wait for data
      await waitFor(() => {
        expect(result.current.data).toBeDefined();
      });

      // Verify data matches mock
      expect(result.current.data?.items).toEqual(mockProducts.items);
    });
  });

  describe('useOrders', () => {
    it('should fetch orders successfully', async () => {
      const { result } = renderHook(() => useOrders('store-1'), { wrapper });

      await waitFor(() => {
        expect(result.current.data).toBeDefined();
      });

      expect(result.current.data?.items).toEqual(mockOrders.items);
    });
  });

  describe('useSession', () => {
    it('should fetch session data successfully', async () => {
      const { result } = renderHook(() => useSession(), { wrapper });

      await waitFor(() => {
        expect(result.current.data).toBeDefined();
      });

      expect(result.current.data).toEqual(mockSession);
    });
  });

  describe('Error Handling', () => {
    it('should handle query errors', async () => {
      // Create router with error response
      const errorRouter = {
        ...createMockRouter(),
        product: {
          list: vi.fn().mockRejectedValue(new Error('Failed to fetch products')),
        },
      };

      const errorWrapper = createWrapper(errorRouter);
      const { result } = renderHook(() => useProducts('store-1'), { 
        wrapper: errorWrapper 
      });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });

      expect(result.current.error?.message).toBe('Failed to fetch products');
    });
  });
});