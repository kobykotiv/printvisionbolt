import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock requestAnimationFrame for monitoring tests
global.requestAnimationFrame = (callback: FrameRequestCallback): number => {
  return setTimeout(() => callback(Date.now()), 0);
};

// Mock window.getComputedStyle
Object.defineProperty(window, 'getComputedStyle', {
  value: (element: Element) => ({
    getPropertyValue: (prop: string) => {
      return '';
    },
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'linear-gradient(to right, transparent, rgba(99, 102, 241, 0.1), transparent)'
  })
});