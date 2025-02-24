import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { logger } from '../features/blueprints/utils/logger';
import { getDefaultRedirectPath } from '../../config/navigation';

interface PublicRouteProps {
  children: React.ReactNode;
  /** If true, authenticated users will be redirected to their dashboard */
  redirectAuthenticated?: boolean;
  /** Additional CSS classes for the wrapper */
  className?: string;
}

export function PublicRoute({ 
  children, 
  redirectAuthenticated = true,
  className = '' 
}: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [redirecting, setRedirecting] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && isAuthenticated && redirectAuthenticated) {
      setRedirecting(true);
      logger.debug('Public route redirect', {
        path: window.location.pathname,
        reason: 'user authenticated',
        timestamp: new Date().toISOString()
      });

      const redirectPath = getDefaultRedirectPath(true);
      // Add a small delay to ensure logging completes
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 100);
    }
  }, [isLoading, isAuthenticated, redirectAuthenticated]);

  if (isLoading || redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingScreen />
      </div>
    );
  }

  // Don't render anything if we're about to redirect
  if (isAuthenticated && redirectAuthenticated) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {children}
      
      {/* Development Mode Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4">
          <div className="bg-gray-800 bg-opacity-75 text-white text-xs px-2 py-1 rounded-md">
            Public Route
          </div>
        </div>
      )}
    </div>
  );
}
