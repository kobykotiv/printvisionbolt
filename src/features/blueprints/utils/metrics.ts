interface ProviderMetrics {
  successfulRequests: number;
  failedRequests: number;
  totalLatency: number;
  requestCount: number;
  rateLimitHits: number;
  lastRequest: Date;
  errors: {
    authentication: number;
    rateLimit: number;
    network: number;
    validation: number;
    other: number;
  };
}

class MetricsCollector {
  private metrics: Map<string, ProviderMetrics>;
  private readonly metricsWindow = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  constructor() {
    this.metrics = new Map();
  }

  /**
   * Initialize metrics for a provider
   */
  initProvider(providerId: string): void {
    if (!this.metrics.has(providerId)) {
      this.metrics.set(providerId, {
        successfulRequests: 0,
        failedRequests: 0,
        totalLatency: 0,
        requestCount: 0,
        rateLimitHits: 0,
        lastRequest: new Date(),
        errors: {
          authentication: 0,
          rateLimit: 0,
          network: 0,
          validation: 0,
          other: 0
        }
      });
    }
  }

  /**
   * Record a successful request
   */
  recordSuccess(providerId: string, latencyMs: number): void {
    const metrics = this.ensureMetrics(providerId);
    metrics.successfulRequests++;
    metrics.requestCount++;
    metrics.totalLatency += latencyMs;
    metrics.lastRequest = new Date();
  }

  /**
   * Record a failed request
   */
  recordFailure(providerId: string, error: Error, latencyMs: number): void {
    const metrics = this.ensureMetrics(providerId);
    metrics.failedRequests++;
    metrics.requestCount++;
    metrics.totalLatency += latencyMs;
    metrics.lastRequest = new Date();

    // Categorize error
    if (error.name === 'AuthenticationError') {
      metrics.errors.authentication++;
    } else if (error.name === 'RateLimitError') {
      metrics.errors.rateLimit++;
      metrics.rateLimitHits++;
    } else if (error.name === 'NetworkError') {
      metrics.errors.network++;
    } else if (error.name === 'ValidationError') {
      metrics.errors.validation++;
    } else {
      metrics.errors.other++;
    }
  }

  /**
   * Get metrics for a specific provider
   */
  getProviderMetrics(providerId: string): ProviderMetrics | null {
    return this.metrics.get(providerId) || null;
  }

  /**
   * Get metrics for all providers
   */
  getAllMetrics(): Map<string, ProviderMetrics> {
    this.pruneOldMetrics();
    return new Map(this.metrics);
  }

  /**
   * Calculate success rate for a provider
   */
  getSuccessRate(providerId: string): number {
    const metrics = this.metrics.get(providerId);
    if (!metrics || metrics.requestCount === 0) return 0;
    return (metrics.successfulRequests / metrics.requestCount) * 100;
  }

  /**
   * Calculate average latency for a provider
   */
  getAverageLatency(providerId: string): number {
    const metrics = this.metrics.get(providerId);
    if (!metrics || metrics.requestCount === 0) return 0;
    return metrics.totalLatency / metrics.requestCount;
  }

  /**
   * Get error breakdown for a provider
   */
  getErrorBreakdown(providerId: string): Record<string, number> {
    const metrics = this.metrics.get(providerId);
    if (!metrics) return {};
    return { ...metrics.errors };
  }

  /**
   * Generate performance report for a provider
   */
  generateReport(providerId: string): ProviderPerformanceReport {
    const metrics = this.metrics.get(providerId);
    if (!metrics) {
      return {
        providerId,
        timestamp: new Date(),
        status: 'unknown',
        metrics: null
      };
    }

    const successRate = this.getSuccessRate(providerId);
    let status: 'healthy' | 'degraded' | 'failing' | 'unknown' = 'unknown';

    if (metrics.requestCount > 0) {
      if (successRate >= 98) status = 'healthy';
      else if (successRate >= 90) status = 'degraded';
      else status = 'failing';
    }

    return {
      providerId,
      timestamp: new Date(),
      status,
      metrics: {
        successRate,
        averageLatency: this.getAverageLatency(providerId),
        requestCount: metrics.requestCount,
        rateLimitHits: metrics.rateLimitHits,
        errorBreakdown: this.getErrorBreakdown(providerId),
        lastRequest: metrics.lastRequest
      }
    };
  }

  /**
   * Reset metrics for a provider
   */
  resetMetrics(providerId: string): void {
    this.initProvider(providerId);
  }

  private ensureMetrics(providerId: string): ProviderMetrics {
    if (!this.metrics.has(providerId)) {
      this.initProvider(providerId);
    }
    return this.metrics.get(providerId)!;
  }

  private pruneOldMetrics(): void {
    const cutoff = Date.now() - this.metricsWindow;
    for (const [providerId, metrics] of this.metrics.entries()) {
      if (metrics.lastRequest.getTime() < cutoff) {
        this.metrics.delete(providerId);
      }
    }
  }
}

export interface ProviderPerformanceReport {
  providerId: string;
  timestamp: Date;
  status: 'healthy' | 'degraded' | 'failing' | 'unknown';
  metrics: null | {
    successRate: number;
    averageLatency: number;
    requestCount: number;
    rateLimitHits: number;
    errorBreakdown: Record<string, number>;
    lastRequest: Date;
  };
}

// Export singleton instance
export const metricsCollector = new MetricsCollector();