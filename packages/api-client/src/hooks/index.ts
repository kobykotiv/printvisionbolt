import { useState, useEffect } from 'react';
import type { 
  Product, 
  Store, 
  Order,
  ProductInput,
  OrderInput,
  StoreInput 
} from '@printvision/api-types';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server/router';

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/trpc',
    }),
  ],
});

export function useApiClient() {
  return trpc;
}

export function useProducts() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const products = await trpc.products.list.query();
      setData(products);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch products'));
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (input: ProductInput) => {
    const product = await trpc.products.create.mutate(input);
    setData(prev => [...prev, product]);
    return product;
  };

  const updateProduct = async (id: string, input: Partial<Product>) => {
    const product = await trpc.products.update.mutate({ id, ...input });
    setData(prev => prev.map(p => p.id === id ? product : p));
    return product;
  };

  const deleteProduct = async (id: string) => {
    await trpc.products.delete.mutate(id);
    setData(prev => prev.filter(p => p.id !== id));
  };

  return {
    products: data,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}

export function useStores() {
  const [data, setData] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const stores = await trpc.stores.list.query();
      setData(stores);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch stores'));
    } finally {
      setLoading(false);
    }
  };

  const createStore = async (input: StoreInput) => {
    const store = await trpc.stores.create.mutate(input);
    setData(prev => [...prev, store]);
    return store;
  };

  const updateStore = async (id: string, input: Partial<Store>) => {
    const store = await trpc.stores.update.mutate({ id, ...input });
    setData(prev => prev.map(s => s.id === id ? store : s));
    return store;
  };

  const deleteStore = async (id: string) => {
    await trpc.stores.delete.mutate(id);
    setData(prev => prev.filter(s => s.id !== id));
  };

  return {
    stores: data,
    loading,
    error,
    fetchStores,
    createStore,
    updateStore,
    deleteStore,
  };
}

export function useOrders() {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const orders = await trpc.orders.list.query();
      setData(orders);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch orders'));
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (input: OrderInput) => {
    const order = await trpc.orders.create.mutate(input);
    setData(prev => [...prev, order]);
    return order;
  };

  const updateOrder = async (id: string, input: Partial<Order>) => {
    const order = await trpc.orders.update.mutate({ id, ...input });
    setData(prev => prev.map(o => o.id === id ? order : o));
    return order;
  };

  const deleteOrder = async (id: string) => {
    await trpc.orders.delete.mutate(id);
    setData(prev => prev.filter(o => o.id !== id));
  };

  return {
    orders: data,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
  };
}

export { useSession, useUser } from './auth';