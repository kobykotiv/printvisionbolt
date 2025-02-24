import { useState, useEffect, useCallback } from 'react';
import { metricsCollector, ProviderPerformanceReport } from '../utils/metrics';
import { configManager } from '../config/environment';
import { logger } from '../utils/logger';

interface UseMetricsMonitorOptions {
  refreshInterval?: number; // in milliseconds
  providerId?: string;
  autoRefresh?: boolean;
}

interface MetricsState {
  reports: Map<string, ProviderPerformanceReport>;
  lastUpdate: Date;
  isRefreshing: boolean;
  error: Error | null;
}

export function useMetricsMonitor(options: UseMetricsMonitorOptions = {}) {
  const {
    refreshInterval = 30000, // Default 30 seconds
    providerId,
    autoRefresh = true
  } = options;

  const [state, setState] = useState<MetricsState>({
    reports: new Map(),
    lastUpdate: new Date(),
    isRefreshing: false,
    error: null
  });

  // Refresh metrics data
  const refreshMetrics = useCallback(async () => {
    if (state.isRefreshing) return;

    setState(current => ({ ...current, isRefreshing: true, error: null }));
    const startTime = Date.now();

    try {
      const newReports = new Map<string, ProviderPerformanceReport>();

      if (providerId) {
        // Single provider metrics
        const report = metricsCollector.generateReport(providerId);
        newReports.set(providerId, report);
      } else {
        // All providers metrics
        const metrics = metricsCollector.getAllMetrics();
        for (const [id] of metrics) {
          const report = metricsCollector.generateReport(id);
          newReports.set(id, report);
        }
      }

      setState(current => ({
        ...current,
        reports: newReports,
        lastUpdate: new Date(),
        isRefreshing: false,
        error: null
      }));

      // Log metrics update in debug mode
      if (configManager.getConfig().features.debugMode) {
        logger.debug('Metrics updated:', {
          duration: Date.now() - startTime,
          providersCount: newReports.size,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      setState(current => ({
        ...current,
        isRefreshing: false,
        error: error instanceof Error ? error : new Error('Failed to refresh metrics')
      }));

      logger.error('Failed to refresh metrics', error instanceof Error ? error : undefined);
    }
  }, [providerId, state.isRefreshing]);

  // Auto-refresh metrics
  useEffect(() => {
    if (!autoRefresh) return;

    // Initial load
    refreshMetrics();

    // Set up refresh interval
    const intervalId = setInterval(refreshMetrics, refreshInterval);

    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval, refreshMetrics]);

  // Get metrics for a specific provider
  const getProviderMetrics = useCallback((id: string) => {
    return state.reports.get(id) || null;
  }, [state.reports]);

  // Calculate aggregate statistics
  const getAggregateStats = useCallback(() => {
    let totalRequests = 0;
    let totalErrors = 0;
    let totalLatency = 0;
    let providerCount = 0;
    let healthyProviders = 0;

    state.reports.forEach(report => {
      if (report.metrics) {
        totalRequests += report.metrics.requestCount;
        totalLatency += report.metrics.averageLatency * report.metrics.requestCount;
        totalErrors += Object.values(report.metrics.errorBreakdown)
          .reduce((sum, count) => sum + count, 0);
        providerCount++;
        if (report.status === 'healthy') healthyProviders++;
      }
    });

    return {
      totalRequests,
      averageLatency: totalRequests > 0 ? totalLatency / totalRequests : 0,
      errorRate: totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0,
      providerHealth: providerCount > 0 ? (healthyProviders / providerCount) * 100 : 0,
      activeProviders: providerCount
    };
  }, [state.reports]);

  // Check if all providers are healthy
  const isSystemHealthy = useCallback(() => {
    if (state.reports.size === 0) return false;
    return Array.from(state.reports.values()).every(report => report.status === 'healthy');
  }, [state.reports]);

  return {
    // State
    reports: state.reports,
    lastUpdate: state.lastUpdate,
    isRefreshing: state.isRefreshing,
    error: state.error,

    // Actions
    refreshMetrics,
    getProviderMetrics,

    // Stats
    aggregateStats: getAggregateStats(),
    isSystemHealthy: isSystemHealthy(),

    // Helpers
    formatDuration: (ms: number) => {
      if (ms < 1000) return `${ms.toFixed(0)}ms`;
      return `${(ms / 1000).toFixed(2)}s`;
    },
    formatDate: (date: Date) => {
      return date.toLocaleString();
    }
  };
}