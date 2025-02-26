import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import Router from './Router';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './contexts/auth/AuthContext';
import { ToastProvider } from './contexts/ToastContext'; // Import ToastProvider
import { Blog } from './pages/Blog';

function App() {
  return (
    <ErrorBoundary>
      <MantineProvider
        theme={{
          primaryColor: 'blue',
          colors: {
            blue: [
              '#f0f9ff',
              '#e0f2fe',
              '#bae6fd',
              '#7dd3fc',
              '#38bdf8',
              '#0ea5e9',
              '#0284c7',
              '#0369a1',
              '#075985',
              '#0c4a6e',
            ],
          },
          fontFamily: 'Inter, sans-serif',
          headings: {
            fontFamily: 'Inter, sans-serif',
          },
        }}
      >
        <ToastProvider> {/* Wrap with ToastProvider */}
          <AuthProvider>
            <BrowserRouter>
              <Router />
            </BrowserRouter>
          </AuthProvider>
        </ToastProvider>
      </MantineProvider>
    </ErrorBoundary>
  );
}

export default App;