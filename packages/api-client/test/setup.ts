<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> dc00547 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Add custom matchers from RTL
<<<<<<< HEAD
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
=======
import '@testing-library/jest-dom';
import { expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

=======
import '@testing-library/jest-dom';
import { expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

>>>>>>> 25869aa (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)
declare global {
  namespace Vi {
    interface Assertion extends matchers.TestingLibraryMatchers<any, void> {}
    interface AsymmetricMatchersContaining extends matchers.TestingLibraryMatchers<any, void> {}
  }
}

// Add custom matchers
<<<<<<< HEAD
>>>>>>> c34d7d5 (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)
=======
>>>>>>> dc00547 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
=======
>>>>>>> 25869aa (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)
expect.extend(matchers);

// Clean up after each test
afterEach(() => {
  cleanup();
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
  vi.clearAllMocks();
>>>>>>> c34d7d5 (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)
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
<<<<<<< HEAD
  // Cleanup any global test configuration
});
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
=======
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
>>>>>>> c34d7d5 (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)
=======
=======
  vi.clearAllMocks();
>>>>>>> 25869aa (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)
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
<<<<<<< HEAD
  // Cleanup any global test configuration
});
>>>>>>> dc00547 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
=======
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
>>>>>>> 25869aa (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)
