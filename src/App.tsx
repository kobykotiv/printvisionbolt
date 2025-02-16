import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AppRoutes } from './Routes';
import { Layout } from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { ShopProvider } from './contexts/ShopContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000, // 30 seconds
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DndProvider backend={HTML5Backend}>
        <AuthProvider>
          <SettingsProvider>
            <ShopProvider>
              <BrowserRouter>
                <Layout>
                  <AppRoutes />
                </Layout>
              </BrowserRouter>
            </ShopProvider>
          </SettingsProvider>
        </AuthProvider>
      </DndProvider>
    </QueryClientProvider>
  );
}

export default App;