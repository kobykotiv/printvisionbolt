import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface LoadingErrorProps {
  message: string;
  onRetry?: () => void;
}

export function LoadingError({ message, onRetry }: LoadingErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Error Loading Data
      </h3>
      <p className="text-gray-500 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
}