import React from 'react';
import { AlertCircle } from 'lucide-react';

interface LoadingTimeoutProps {
  timeout?: number;
  children: React.ReactNode;
  fallback: React.ReactNode;
}

export function LoadingTimeout({
  timeout = 10000,
  children,
  fallback
}: LoadingTimeoutProps) {
  const [showTimeout, setShowTimeout] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimeout(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  if (showTimeout) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Taking longer than expected...
        </h3>
        <div className="text-gray-500">{fallback}</div>
      </div>
    );
  }

  return <>{children}</>;
}