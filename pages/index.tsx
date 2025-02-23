import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { LoadingScreen } from '@/components/common/LoadingScreen';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/app/dashboard');
  }, [router]);

  return <LoadingScreen message="Redirecting..." />;
}
