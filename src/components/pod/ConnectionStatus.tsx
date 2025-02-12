import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { PodConnection } from '../../lib/types/pod';

interface ConnectionStatusProps {
  connection: PodConnection;
  onTest?: () => Promise<void>;
}

export function ConnectionStatus({ connection, onTest }: ConnectionStatusProps) {
  const [testing, setTesting] = React.useState(false);

  const handleTest = async () => {
    if (!onTest) return;
    setTesting(true);
    try {
      await onTest();
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {connection.status === 'connected' && (
        <CheckCircle2 className="h-5 w-5 text-green-500" />
      )}
      {connection.status === 'disconnected' && (
        <XCircle className="h-5 w-5 text-gray-400" />
      )}
      {connection.status === 'error' && (
        <AlertTriangle className="h-5 w-5 text-red-500" />
      )}
      <span
        className={cn(
          "text-sm font-medium",
          connection.status === 'connected' && "text-green-700",
          connection.status === 'disconnected' && "text-gray-500",
          connection.status === 'error' && "text-red-700"
        )}
      >
        {connection.status === 'connected' && 'Connected'}
        {connection.status === 'disconnected' && 'Disconnected'}
        {connection.status === 'error' && 'Error'}
      </span>
      {connection.lastSyncedAt && (
        <span className="text-sm text-gray-500">
          Last synced: {new Date(connection.lastSyncedAt).toLocaleString()}
        </span>
      )}
      {onTest && (
        <button
          onClick={handleTest}
          disabled={testing}
          className="ml-2 inline-flex items-center px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <RefreshCw
            className={cn(
              "h-4 w-4 mr-1",
              testing && "animate-spin"
            )}
          />
          Test Connection
        </button>
      )}
      {connection.error && (
        <span className="text-sm text-red-600">{connection.error}</span>
      )}
    </div>
  );
}