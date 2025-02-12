import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function DemoLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signInWithToken } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('Invalid demo link');
      return;
    }

    signInWithToken(token)
      .then(() => {
        navigate('/app');
      })
      .catch((err) => {
        console.error('Demo login error:', err);
        setError('Failed to access demo account');
      });
  }, [searchParams, signInWithToken, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="text-indigo-600 hover:text-indigo-500"
          >
            Return to homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          Accessing Demo Account...
        </h2>
        <p className="mt-2 text-gray-500">
          You'll be redirected to the dashboard in a moment.
        </p>
      </div>
    </div>
  );
}
