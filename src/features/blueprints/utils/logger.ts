import { configManager } from '../config/environment';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  provider?: string;
  details?: Record<string, unknown>;
  error?: Error;
}

class BlueprintLogger {
  private debugMode: boolean;
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;

  constructor() {
    this.debugMode = configManager.getConfig().features.debugMode;
  }

  /**
   * Log a debug message
   */
  debug(message: string, details?: Record<string, unknown>) {
    if (this.debugMode) {
      this.log('debug', message, details);
    }
  }

  /**
   * Log an info message
   */
  info(message: string, details?: Record<string, unknown>) {
    this.log('info', message, details);
  }

  /**
   * Log a warning message
   */
  warn(message: string, details?: Record<string, unknown>) {
    this.log('warn', message, details);
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error, details?: Record<string, unknown>) {
    this.log('error', message, { ...details, error });
  }

  /**
   * Log a provider-specific message
   */
  provider(providerId: string, message: string, details?: Record<string, unknown>) {
    this.log('info', message, { ...details, provider: providerId });
  }

  /**
   * Log an API call
   */
  apiCall(providerId: string, endpoint: string, details?: Record<string, unknown>) {
    this.debug(`API Call: ${endpoint}`, {
      ...details,
      provider: providerId,
      timestamp: Date.now()
    });
  }

  /**
   * Log an API response
   */
  apiResponse(
    providerId: string,
    endpoint: string,
    status: number,
    duration: number,
    details?: Record<string, unknown>
  ) {
    this.debug(`API Response: ${endpoint}`, {
      ...details,
      provider: providerId,
      status,
      duration,
      timestamp: Date.now()
    });
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return this.logs;
  }

  /**
   * Get logs for a specific provider
   */
  getProviderLogs(providerId: string): LogEntry[] {
    return this.logs.filter(log => log.provider === providerId);
  }

  /**
   * Get error logs
   */
  getErrorLogs(): LogEntry[] {
    return this.logs.filter(log => log.level === 'error');
  }

  /**
   * Clear logs
   */
  clearLogs() {
    this.logs = [];
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    const apiCalls = this.logs.filter(log => 
      log.details && Object.prototype.hasOwnProperty.call(log.details, 'duration')
    );
    
    if (apiCalls.length === 0) {
      return null;
    }

    const durations = apiCalls.map(log => (log.details?.duration as number) || 0);
    const totalDuration = durations.reduce((sum, duration) => sum + duration, 0);
    
    return {
      totalCalls: apiCalls.length,
      averageDuration: totalDuration / apiCalls.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      errorRate: (this.getErrorLogs().length / this.logs.length) * 100,
      successfulCalls: apiCalls.filter(log => 
        log.details && (log.details.status as number) < 400
      ).length,
      failedCalls: apiCalls.filter(log => 
        log.details && (log.details.status as number) >= 400
      ).length
    };
  }

  private log(level: LogLevel, message: string, details?: Record<string, unknown>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      details
    };

    if (details && Object.prototype.hasOwnProperty.call(details, 'provider')) {
      entry.provider = details.provider as string;
    }

    if (details && details.error instanceof Error) {
      entry.error = details.error;
    }

    this.logs.unshift(entry);

    // Trim logs if they exceed the maximum
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Console output in debug mode
    if (this.debugMode) {
      const consoleMethod = level === 'error' ? 'error' :
                          level === 'warn' ? 'warn' :
                          level === 'info' ? 'info' :
                          'debug';
      
      console[consoleMethod](`[${level.toUpperCase()}] ${message}`, {
        timestamp: entry.timestamp,
        ...details
      });
    }
  }

  /**
   * Enable debug mode
   */
  enableDebug() {
    this.debugMode = true;
  }

  /**
   * Disable debug mode
   */
  disableDebug() {
    this.debugMode = false;
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify({
      logs: this.logs,
      metrics: this.getMetrics(),
      timestamp: new Date().toISOString(),
      debugMode: this.debugMode
    }, null, 2);
  }
}

// Export singleton instance
export const logger = new BlueprintLogger();