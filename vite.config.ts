import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@printvision/shared': path.resolve(__dirname, '../shared/src'),
      '@printvision/ui': path.resolve(__dirname, '../ui/src')
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@printvision/shared', '@printvision/ui']
  },
  server: {
    watch: {
      usePolling: false // Bun has better file watching
    }
  },
  build: {
    target: 'esnext', // Bun supports modern features
    rollupOptions: {
      external: ['@printvision/shared', '@printvision/ui']
    }
  }
});
