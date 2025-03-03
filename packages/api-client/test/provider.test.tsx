import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ApiProvider, useApi } from '../src/provider';

// Mock trpc client
vi.mock('@trpc/react-query', () => ({
  createTRPCReact: () => ({
    Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }),
}));

// Mock QueryClientProvider
vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn(() => ({
    defaultOptions: {},
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('ApiProvider', () => {
  const defaultProps = {
    url: 'http://localhost:3001/api/trpc',
  };

  it('renders children without crashing', () => {
    render(
      <ApiProvider {...defaultProps}>
        <div data-testid="test-child">Test Content</div>
      </ApiProvider>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('provides api context to children', async () => {
    let contextValue;

    function TestComponent() {
      const api = useApi();
      contextValue = api;
      return null;
    }

    render(
      <ApiProvider {...defaultProps}>
        <TestComponent />
      </ApiProvider>
    );

    await waitFor(() => {
      expect(contextValue).toBeDefined();
    });
  });

  it('accepts custom headers', () => {
    const headers = {
      'Custom-Header': 'test-value',
    };

    render(
      <ApiProvider {...defaultProps} headers={headers}>
        <div>Test Content</div>
      </ApiProvider>
    );

    // The headers are passed to the trpc client config
    // We're just testing that the provider renders with custom headers
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('throws error when useApi is used outside provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    function TestComponent() {
      useApi();
      return null;
    }

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useApi must be used within an ApiProvider');

    consoleError.mockRestore();
  });
});