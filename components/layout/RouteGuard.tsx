import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoadingScreen } from '../common/LoadingScreen';
import { 
  isPublicPath, 
  getDefaultRedirectPath, 
  getAllPaths 
} from '../../config/navigation';
import { logger } from '../../src/features/blueprints/utils/logger';
import { NotFound } from '../../src/components/NotFound';

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const currentPath = window.location.pathname;

  // Check if the current path exists in our defined routes
  const isValidPath = getAllPaths().some(path => 
    currentPath === path || currentPath.startsWith(`${path}/`)
  );

  useEffect(() => {
    if (!isLoading) {
      const shouldRedirect = !isPublicPath(currentPath) && !isAuthenticated;
      const isAuthPage = currentPath.startsWith('/auth/');

      // Get appropriate redirect path
      let redirectPath = getDefaultRedirectPath(isAuthenticated);
      
      // If user is already authenticated and tries to access auth pages,
      // redirect to dashboard
      if (isAuthPage && isAuthenticated) {
        redirectPath = '/app/dashboard';
      }

      if (shouldRedirect || (isAuthPage && isAuthenticated)) {
        logger.debug('Route guard redirect', {
          from: currentPath,
          to: redirectPath,
          reason: shouldRedirect ? 'unauthorized' : 'already authenticated',
          timestamp: new Date().toISOString()
        });
        
        window.history.pushState({}, '', redirectPath);
        // Dispatch navigation event to update UI
        window.dispatchEvent(new CustomEvent('navigation', { 
          detail: { path: redirectPath } 
        }));
      }
    }
  }, [isAuthenticated, isLoading, currentPath]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show 404 for invalid paths
  if (!isValidPath) {
    return <NotFound />;
  }

  // Don't render protected content for unauthenticated users
  if (!isPublicPath(currentPath) && !isAuthenticated) {
    logger.debug('Protected route access denied', {
      path: currentPath,
      timestamp: new Date().toISOString()
    });
    return <LoadingScreen />;
  }

  // Wrap the children in error boundary (assuming it's defined elsewhere)
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Route error boundary caught error:', error, {
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
