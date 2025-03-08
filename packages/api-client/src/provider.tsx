import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useApiClient, trpc } from './hooks';

interface ApiProviderProps {
  children: React.ReactNode;
  url: string;
  headers?: Record<string, string>;
  queryClient?: QueryClient;
}

export function ApiProvider({
  children,
  url,
  headers,
  queryClient: externalQueryClient,
}: ApiProviderProps) {
  const { trpcClient, queryClient: internalQueryClient } = useApiClient({
    url,
    headers,
  });

  const queryClient = externalQueryClient || internalQueryClient;

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export function useApi() {
  return trpc;
}