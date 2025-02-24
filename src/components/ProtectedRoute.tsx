import React from 'react';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { useAuth } from '../../hooks/useAuth';
import { logger } from '../features/blueprints/utils/logger';
import { getDefaultRedirectPath } from '../../config/navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [redirecting, setRedirecting] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setRedirecting(true);
      logger.debug('Protected route access denied', {
        path: window.location.pathname,
        reason: 'unauthenticated',
        timestamp: new Date().toISOString()
      });

      const redirectPath = getDefaultRedirectPath(false);
      window.location.href = redirectPath;
    }
  }, [isLoading, isAuthenticated]);

  if (isLoading || redirecting) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-full">
      {children}
    </div>
  );
}
