import '@testing-library/jest-dom';
import { expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

declare global {
  namespace Vi {
    interface Assertion extends matchers.TestingLibraryMatchers<any, void> {}
    interface AsymmetricMatchersContaining extends matchers.TestingLibraryMatchers<any, void> {}
  }
}

// Add custom matchers
expect.extend(matchers);

// Clean up after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Global test setup
beforeAll(() => {
  // Mock window.fetch and other browser APIs if needed
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

// Global test teardown
afterAll(() => {
  vi.clearAllMocks();
});

// Configure global mocks
vi.mock('@trpc/client', async () => {
  const actual = await vi.importActual('@trpc/client');
  return {
    ...actual,
    createTRPCProxyClient: vi.fn(),
  };
});

// Export commonly used test utilities
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { vi };