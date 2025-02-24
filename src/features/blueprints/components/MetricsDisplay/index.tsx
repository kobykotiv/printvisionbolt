import React from 'react';
import { Card } from '../../../../../components/ui/Card';
import { useMetricsMonitor } from '../../hooks/useMetricsMonitor';
import { ProviderPerformanceReport } from '../../utils/metrics';

interface MetricsDisplayProps {
  providerId?: string;
  className?: string;
}

export function MetricsDisplay({ providerId, className = '' }: MetricsDisplayProps) {
  const { 
    reports,
    aggregateStats,
    isSystemHealthy,
    lastUpdate,
    isRefreshing,
    formatDuration,
    formatDate
  } = useMetricsMonitor({
    providerId,
    refreshInterval: 30000,
    autoRefresh: true
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'failing': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 98) return 'bg-green-500';
    if (rate >= 90) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // System Health Overview
  const SystemHealth = () => (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
            isSystemHealthy
              ? 'text-green-600 bg-green-50 border-green-200'
              : 'text-red-600 bg-red-50 border-red-200'
          }`}>
            {isSystemHealthy ? 'All Systems Operational' : 'System Degraded'}
          </span>
          <span className="text-sm text-gray-500">
            Last updated: {formatDate(lastUpdate)}
            {isRefreshing && <span className="ml-2 animate-pulse">•</span>}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500 mb-1">Active Providers</div>
          <div className="text-2xl font-bold text-gray-900">{aggregateStats.activeProviders}</div>
          <div className="text-sm text-gray-500 mt-1">
            {Math.round(aggregateStats.providerHealth)}% healthy
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Requests</div>
          <div className="text-2xl font-bold text-gray-900">{aggregateStats.totalRequests}</div>
          <div className="text-sm text-gray-500 mt-1">
            Last 24 hours
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500 mb-1">Average Latency</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatDuration(aggregateStats.averageLatency)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Across all providers
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-500 mb-1">Error Rate</div>
          <div className="text-2xl font-bold text-gray-900">
            {aggregateStats.errorRate.toFixed(2)}%
          </div>
          <div className="text-sm text-gray-500 mt-1">
            System-wide average
          </div>
        </div>
      </div>
    </Card>
  );

  // Provider Specific Metrics
  const ProviderMetrics = ({ id, report }: { id: string; report: ProviderPerformanceReport }) => {
    if (!report.metrics) {
      return (
        <div className="text-gray-500 text-center py-8">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="mt-2">No metrics available for {id}</p>
        </div>
      );
    }

    const errorEntries = Object.entries(report.metrics.errorBreakdown) as [string, number][];

    return (
      <div className="space-y-4">
        {/* Status Badge */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-500">Status</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize border ${getStatusColor(report.status)}`}>
            {report.status}
          </span>
        </div>

        {/* Success Rate */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-500">Success Rate</span>
            <span className="text-sm font-medium text-gray-900">
              {report.metrics.successRate.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`rounded-full h-2 transition-all duration-500 ${getSuccessRateColor(report.metrics.successRate)}`}
              style={{ width: `${Math.min(100, report.metrics.successRate)}%` }}
            />
          </div>
        </div>

        {/* Request Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <span className="text-sm font-medium text-gray-500">Total Requests</span>
            <p className="text-xl font-semibold text-gray-900 mt-1">{report.metrics.requestCount}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <span className="text-sm font-medium text-gray-500">Avg. Latency</span>
            <p className="text-xl font-semibold text-gray-900 mt-1">
              {formatDuration(report.metrics.averageLatency)}
            </p>
          </div>
        </div>

        {/* Error Breakdown */}
        {errorEntries.some(([, count]) => count > 0) && (
          <div className="bg-red-50 rounded-lg p-4">
            <span className="text-sm font-medium text-red-800 mb-2 block">Error Breakdown</span>
            <div className="space-y-2">
              {errorEntries
                .filter(([, count]) => count > 0)
                .map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-sm capitalize text-red-600">{type}</span>
                    <span className="text-sm font-medium text-red-600">{count}</span>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* Rate Limiting */}
        {report.metrics.rateLimitHits > 0 && (
          <div className="flex justify-between items-center text-yellow-600 bg-yellow-50 px-4 py-3 rounded-lg border border-yellow-200">
            <div>
              <span className="text-sm font-medium block">Rate Limit Hits</span>
              <span className="text-xs text-yellow-500">May affect performance</span>
            </div>
            <span className="text-lg font-semibold">{report.metrics.rateLimitHits}</span>
          </div>
        )}

        {/* Last Request */}
        <div className="text-xs text-gray-500 border-t pt-4 mt-4">
          Last Activity: {formatDate(report.metrics.lastRequest)}
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <SystemHealth />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from(reports.entries()).map(([id, report]) => (
          <Card key={id} className="p-4">
            <h3 className="text-lg font-semibold mb-4 capitalize">{id} Metrics</h3>
            <ProviderMetrics id={id} report={report} />
          </Card>
        ))}
      </div>
    </div>
  );
}