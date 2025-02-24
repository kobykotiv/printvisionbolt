import React, { useState, useEffect } from 'react';
import { logger } from '../../utils/logger';
import { Card } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';

interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
  provider?: string;
  details?: Record<string, unknown>;
  error?: Error;
}

interface Metrics {
  totalCalls: number;
  averageDuration: number;
  minDuration: number;
  maxDuration: number;
  errorRate: number;
  successfulCalls: number;
  failedCalls: number;
}

export function BlueprintMonitor() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<string | 'all'>('all');
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // Fetch logs and metrics
  const updateData = () => {
    const allLogs = logger.getLogs();
    const filteredLogs = allLogs.filter(log => {
      const providerMatch = selectedProvider === 'all' || log.provider === selectedProvider;
      const levelMatch = selectedLevel === 'all' || log.level === selectedLevel;
      return providerMatch && levelMatch;
    });

    setLogs(filteredLogs);
    setMetrics(logger.getMetrics());
  };

  // Auto-refresh logs
  useEffect(() => {
    if (isAutoRefresh) {
      const interval = setInterval(updateData, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoRefresh, selectedProvider, selectedLevel]);

  // Format duration in milliseconds
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-50';
      case 'warn': return 'text-yellow-600 bg-yellow-50';
      case 'info': return 'text-blue-600 bg-blue-50';
      case 'debug': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-4">
      {/* Controls */}
      <div className="mb-4 flex items-center gap-4">
        <select
          className="form-select"
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
        >
          <option value="all">All Providers</option>
          <option value="printify">Printify</option>
          <option value="printful">Printful</option>
          <option value="gooten">Gooten</option>
          <option value="gelato">Gelato</option>
        </select>

        <select
          className="form-select"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
        >
          <option value="all">All Levels</option>
          <option value="debug">Debug</option>
          <option value="info">Info</option>
          <option value="warn">Warning</option>
          <option value="error">Error</option>
        </select>

        <Button
          variant="outline"
          size="sm"
          label={isAutoRefresh ? 'Pause Refresh' : 'Resume Refresh'}
          onClick={() => setIsAutoRefresh(!isAutoRefresh)}
        />

        <Button
          variant="outline"
          size="sm"
          label="Refresh Now"
          onClick={updateData}
        />

        <Button
          variant="outline"
          size="sm"
          label="Clear Logs"
          onClick={() => {
            logger.clearLogs();
            updateData();
          }}
        />

        <Button
          variant="outline"
          size="sm"
          label="Export Logs"
          onClick={() => {
            const blob = new Blob([logger.exportLogs()], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `blueprint-logs-${new Date().toISOString()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
        />
      </div>

      {/* Metrics */}
      {metrics && (
        <Card className="mb-4 p-4">
          <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-500">Total API Calls</div>
              <div className="text-2xl font-semibold">{metrics.totalCalls}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Average Response Time</div>
              <div className="text-2xl font-semibold">{formatDuration(metrics.averageDuration)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Success Rate</div>
              <div className="text-2xl font-semibold">
                {((metrics.successfulCalls / metrics.totalCalls) * 100).toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Error Rate</div>
              <div className="text-2xl font-semibold text-red-600">
                {metrics.errorRate.toFixed(1)}%
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Logs */}
      <Card className="overflow-hidden">
        <div className="max-h-[600px] overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${getLogLevelColor(log.level)}`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.provider || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {log.message}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {log.details && (
                      <pre className="text-xs">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    )}
                    {log.error && (
                      <div className="text-red-600 text-xs mt-1">
                        {log.error.message}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}