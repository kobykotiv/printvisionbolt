import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useFeatureCheck } from '../hooks/useFeatureCheck';

interface ProtectedRouteProps {
  feature: string;
  children: React.ReactNode;
  fallbackPath?: string;
  loadingComponent?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  feature,
  children,
  fallbackPath = '/upgrade',
  loadingComponent
}) => {
  const router = useRouter();
  const { hasAccess, isLoading } = useFeatureCheck(feature);

  useEffect(() => {
    if (!isLoading && !hasAccess) {
      router.push(fallbackPath);
    }
  }, [hasAccess, isLoading, router, fallbackPath]);

  if (isLoading) {
    return loadingComponent || (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
};

interface ProtectedComponentProps {
  [key: string]: any;
}

export const withFeatureProtection = (
  feature: string,
  fallbackPath?: string,
  loadingComponent?: React.ReactNode
) => {
  return function FeatureProtectedComponent<P extends ProtectedComponentProps>(
    WrappedComponent: React.ComponentType<P>
  ) {
    return function ProtectedComponent(props: P) {
      return (
        <ProtectedRoute 
          feature={feature} 
          fallbackPath={fallbackPath}
          loadingComponent={loadingComponent}
        >
          <WrappedComponent {...props} />
        </ProtectedRoute>
      );
    };
  };
};

// Example usage:
/*
// Protect a component
const AnalyticsDashboard = withFeatureProtection('analytics')(Dashboard);

// Or protect a route
function SettingsPage() {
  return (
    <ProtectedRoute feature="settings">
      <Settings />
    </ProtectedRoute>
  );
}
*/

export default ProtectedRoute;
