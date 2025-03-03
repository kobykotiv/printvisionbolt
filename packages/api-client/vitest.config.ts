import { defineConfig } from 'vitest/config';
<<<<<<< HEAD

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    include: ['test/**/*.{test,spec}.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@printvisionbolt/api-types': '../api-types/src'
    }
  }
=======
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
});