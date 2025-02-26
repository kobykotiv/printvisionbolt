import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  /**
   * Type of loading state to display
   */
  type?: 'spinner' | 'skeleton';
  
  /**
   * Number of skeleton items to show
   */
  count?: number;
  
  /**
   * Custom message to display
   */
  message?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Layout for skeleton items
   */
  layout?: 'grid' | 'list';
  
  /**
   * Number of grid columns (when layout is 'grid')
   */
  columns?: number;
}

export function LoadingState({
  type = 'spinner',
  count = 4,
  message = 'Loading...',
  className = '',
  layout = 'grid',
  columns = 4
}: LoadingStateProps) {
  if (type === 'spinner') {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    );
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div 
      className={`
        ${layout === 'grid' ? `grid ${gridCols} gap-6` : 'space-y-4'}
        ${className}
      `}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
          <div className="h-8 w-8 bg-gray-200 rounded-md mb-4" />
          <div className="space-y-3">
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Custom hook to manage loading state with timeout
 */
export function useLoadingWithTimeout(initialState = false, timeout = 500) {
  const [isLoading, setIsLoading] = React.useState(initialState);
  const timer = React.useRef<NodeJS.Timeout>();

  const startLoading = React.useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = React.useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      setIsLoading(false);
    }, timeout);
  }, [timeout]);

  React.useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  return {
    isLoading,
    startLoading,
    stopLoading
  };
}