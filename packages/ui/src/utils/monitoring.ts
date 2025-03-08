export const PERFORMANCE_THRESHOLDS = {
  FPS_CRITICAL: 30,
  FPS_WARNING: 45,
  RENDER_TIME_CRITICAL: 16, // ~60fps
  RENDER_TIME_WARNING: 8    // ~120fps
};

class PerformanceMonitor {
  private metrics: number[] = [];
  private subscribers: ((metrics: number[]) => void)[] = [];
  private lastFrameTime: number = performance.now();
  private frameCount: number = 0;

  constructor() {
    this.startMonitoring();
  }

  private startMonitoring() {
    const frame = () => {
      const now = performance.now();
      const delta = now - this.lastFrameTime;
      this.lastFrameTime = now;

      this.frameCount++;
      this.metrics.push(delta);

      if (this.metrics.length > 100) {
        this.metrics.shift();
      }

      this.notifySubscribers();
      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.metrics));
  }

  getAverageFPS(): number {
    const sum = this.metrics.reduce((acc, val) => acc + val, 0);
    const avg = sum / this.metrics.length;
    return 1000 / avg;
  }

  getAverageRenderTime(): number {
    return this.metrics.reduce((acc, val) => acc + val, 0) / this.metrics.length;
  }

  subscribe(callback: (metrics: number[]) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }
}

export const monitor = new PerformanceMonitor();

export function usePerformanceMonitoring(componentName: string) {
  return {
    logRender: () => {
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[Performance] ${componentName} rendered`);
      }
    },
    logError: (error: Error) => {
      console.error(`[Performance] ${componentName} error:`, error);
    }
  };
}