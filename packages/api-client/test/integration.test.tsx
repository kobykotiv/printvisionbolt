import React from 'react';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createWrapper } from './wrapper';
import { useProducts, useOrders, useSession } from '../src/hooks';
import { mockProducts, mockOrders, mockSession, createMockRouter, type MockRouter } from './utils';

describe('API Client Integration', () => {
  let wrapper: ReturnType<typeof createWrapper>;
  let mockRouter: MockRouter;

  beforeEach(() => {
    mockRouter = createMockRouter();
=======
import { describe, it, expect, beforeEach } from 'vitest';
=======
import { describe, it, expect, beforeEach, vi } from 'vitest';
>>>>>>> 5128fa2 (ah)
import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from './wrapper';
import { useProducts, useOrders, useSession } from '../src/hooks';
import { mockProducts, mockOrders, mockSession, createMockRouter, type MockRouter } from './utils';

describe('API Client Integration', () => {
  let wrapper: ReturnType<typeof createWrapper>;
  let mockRouter: MockRouter;

  beforeEach(() => {
<<<<<<< HEAD
    const mockRouter = createMockRouter();
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
=======
    mockRouter = createMockRouter();
>>>>>>> 5128fa2 (ah)
=======
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createWrapper } from './wrapper';
import { useProducts, useOrders, useSession } from '../src/hooks';
import { mockProducts, mockOrders, mockSession, createMockRouter } from './utils';

describe('API Client Integration', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  beforeEach(() => {
    const mockRouter = createMockRouter();
>>>>>>> dc00547 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
      // Create router with error response for products
      const errorRouter: MockRouter = {
        ...mockRouter,
        product: {
          ...mockRouter.product,
          list: vi.fn().mockRejectedValue(new Error('Failed to fetch products')),
          get: mockRouter.product.get,
=======
      // Create router with error response
      const errorRouter = {
        ...createMockRouter(),
=======
      // Create router with error response for products
      const errorRouter: MockRouter = {
        ...mockRouter,
>>>>>>> 5128fa2 (ah)
        product: {
          ...mockRouter.product,
          list: vi.fn().mockRejectedValue(new Error('Failed to fetch products')),
<<<<<<< HEAD
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
=======
          get: mockRouter.product.get,
>>>>>>> 5128fa2 (ah)
=======
      // Create router with error response
      const errorRouter = {
        ...createMockRouter(),
        product: {
          list: vi.fn().mockRejectedValue(new Error('Failed to fetch products')),
>>>>>>> dc00547 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 5128fa2 (ah)

    it('should handle network errors', async () => {
      // Create router with network error
      const networkErrorRouter: MockRouter = {
        ...mockRouter,
        product: {
          ...mockRouter.product,
          list: vi.fn().mockRejectedValue(new Error('Network Error')),
          get: mockRouter.product.get,
        },
      };

      const errorWrapper = createWrapper(networkErrorRouter);
      const { result } = renderHook(() => useProducts('store-1'), { 
        wrapper: errorWrapper 
      });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
      });

      expect(result.current.error?.message).toBe('Network Error');
    });
<<<<<<< HEAD
=======
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
=======
>>>>>>> 5128fa2 (ah)
=======
>>>>>>> dc00547 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
  });
});