import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoadingScreen } from '../common/LoadingScreen';
import React from 'react';

const PUBLIC_PATHS = ['/auth/login', '/auth/register', '/auth/forgot-password', '/'];
const APP_PREFIX = '/app';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !PUBLIC_PATHS.includes(router.pathname)) {
      router.push('/');
    } else if (isAuthenticated && router.pathname === '/') {
      router.replace('/dashboard');
    } else if (isAuthenticated && router.pathname.startsWith(APP_PREFIX) && !PUBLIC_PATHS.includes(router.pathname)) {
      router.replace(router.pathname.replace(APP_PREFIX, ''));
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  return <>{children}</>;
}
