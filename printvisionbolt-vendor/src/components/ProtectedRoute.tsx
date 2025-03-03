import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle } from 'lucide-react';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface AuthWarningProps {
  message: string;
}

function AuthWarning({ message }: AuthWarningProps) {
  return (
    <div className="fixed top-4 right-4 flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg shadow-lg">
      <AlertCircle className="h-5 w-5" />
      <span>{message}</span>
    </div>
  );
}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [showWarning, setShowWarning] = React.useState(false);

  React.useEffect(() => {
    if (!user && !loading) {
      setShowWarning(true);
      const timer = setTimeout(() => {
        setShowWarning(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    if (showWarning) {
      return (
        <>
          <Navigate to="/" replace />
          <AuthWarning message="Please log in to access this content" />
        </>
      );
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
