import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock window.matchMedia for glass effects testing
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {},
    addEventListener: function() {},
    removeEventListener: function() {},
    dispatchEvent: function() { return true; },
  };
};

// Create a mock performance observer
window.PerformanceObserver = class {
  constructor(callback: PerformanceObserverCallback) {}
  observe() { return undefined; }
  disconnect() {}
  takeRecords() { return []; }
};

// Mock window.performance.now()
if (!window.performance) {
  window.performance = {
    now: () => Date.now(),
    mark: () => {},
    measure: () => {},
    getEntriesByName: () => [],
    getEntriesByType: () => [],
    clearMarks: () => {},
    clearMeasures: () => {},
    timeOrigin: Date.now()
  };
}

// Mock requestAnimationFrame and cancelAnimationFrame
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (callback: FrameRequestCallback) =>
    setTimeout(() => callback(performance.now()), 0);
  window.cancelAnimationFrame = (id: number) => clearTimeout(id);
}