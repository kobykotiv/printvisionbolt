import { FeatureProvider } from './contexts/FeatureContext';
import { useAuth } from './hooks/useAuth'; // Assuming this exists

export function App() {
  const { user } = useAuth();
  const userTier = user?.tier || 'free';

  return (
    <FeatureProvider tier={userTier}>
      {/* ...existing code... */}
    </FeatureProvider>
  );
}
