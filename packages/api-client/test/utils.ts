import { type AppRouter } from '@printvisionbolt/api/src/server/root';
import { createTRPCReact } from '@trpc/react-query';
import { QueryClient } from '@tanstack/react-query';
import { vi } from 'vitest';

export const trpc = createTRPCReact<AppRouter>();

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export const mockProducts = {
  items: [
    { 
      id: '1',
      title: 'Test Product 1',
      description: 'Test description 1',
      price: 29.99,
      status: 'published' as const,
      metadata: {},
      images: ['test1.jpg'],
      store_id: 'store-1',
      vendor_id: 'vendor-1',
      stock: 100,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      print_provider_id: null,
      category_id: null,
      variants: [],
      shipping_profile_id: null,
    },
    {
      id: '2',
      title: 'Test Product 2',
      description: 'Test description 2',
      price: 39.99,
      status: 'published' as const,
      metadata: {},
      images: ['test2.jpg'],
      store_id: 'store-1',
      vendor_id: 'vendor-1',
      stock: 50,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      print_provider_id: null,
      category_id: null,
      variants: [],
      shipping_profile_id: null,
    },
  ],
  nextCursor: null,
};

export const mockOrders = {
  items: [
    {
      id: '1',
      status: 'pending' as const,
      total: 29.99,
      store_id: 'store-1',
      customer_id: null,
      items: [],
      shipping_address: {},
      billing_address: {},
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tracking_number: null,
      provider_order_id: null,
      notes: null,
      currency: 'USD',
      tax_amount: 0,
      shipping_amount: 0,
      discount_amount: 0,
    },
    {
      id: '2',
      status: 'completed' as const,
      total: 39.99,
      store_id: 'store-1',
      customer_id: null,
      items: [],
      shipping_address: {},
      billing_address: {},
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tracking_number: null,
      provider_order_id: null,
      notes: null,
      currency: 'USD',
      tax_amount: 0,
      shipping_amount: 0,
      discount_amount: 0,
    },
  ],
  nextCursor: null,
};

export const mockSession = {
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

export function createMockRouter() {
  return {
    product: {
      list: vi.fn().mockResolvedValue(mockProducts),
      get: vi.fn().mockImplementation((id: string) => 
        Promise.resolve(mockProducts.items.find(p => p.id === id))
      ),
    },
    order: {
      list: vi.fn().mockResolvedValue(mockOrders),
      get: vi.fn().mockImplementation((id: string) =>
        Promise.resolve(mockOrders.items.find(o => o.id === id))
      ),
    },
    auth: {
      getSession: vi.fn().mockResolvedValue(mockSession),
      getUser: vi.fn().mockResolvedValue(mockSession.user),
    },
  };
}