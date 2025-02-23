import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoadingScreen } from '@/components/common/LoadingScreen';

const PUBLIC_PATHS = ['/auth/login', '/auth/register', '/auth/forgot-password'];
const APP_PREFIX = '/app';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !PUBLIC_PATHS.includes(router.pathname)) {
        router.push('/auth/login');
      } else if (isAuthenticated && router.pathname === '/') {
        router.replace('/app/dashboard');
      } else if (isAuthenticated && !router.pathname.startsWith(APP_PREFIX) && !PUBLIC_PATHS.includes(router.pathname)) {
        router.replace('/app/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  return <>{children}</>;
}
