import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { ApiProvider } from '../src/provider';
import { useProducts, useProduct, useOrders, useSession } from '../src/hooks';

// Mock trpc responses
const mockProducts = {
  items: [
    { id: '1', title: 'Test Product 1' },
    { id: '2', title: 'Test Product 2' },
  ],
  nextCursor: null,
};

const mockProduct = {
  id: '1',
  title: 'Test Product 1',
  description: 'Test description',
};

const mockOrders = {
  items: [
    { id: '1', status: 'pending' },
    { id: '2', status: 'completed' },
  ],
  nextCursor: null,
};

const mockSession = {
  user: { id: '1', email: 'test@example.com' },
};

// Create wrapper component for tests
function createWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <ApiProvider url="http://localhost:3001/api/trpc">
        {children}
      </ApiProvider>
    );
  };
}

describe('API Hooks', () => {
  it('useProducts should fetch products', async () => {
    const { result } = renderHook(() => useProducts('store-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });

  it('useProduct should fetch a single product', async () => {
    const { result } = renderHook(() => useProduct('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });

  it('useOrders should fetch orders', async () => {
    const { result } = renderHook(() => useOrders('store-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });

  it('useSession should fetch current session', async () => {
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });

  it('should handle loading states', () => {
    const { result } = renderHook(() => useProducts('store-1'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should handle error states', async () => {
    // Mock an error response
    vi.mock('@trpc/client', () => ({
      createTRPCProxyClient: () => ({
        product: {
          list: () => Promise.reject(new Error('Test error')),
        },
      }),
    }));

    const { result } = renderHook(() => useProducts('store-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });
});