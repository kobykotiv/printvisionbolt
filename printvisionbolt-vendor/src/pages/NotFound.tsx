import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function NotFound() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/app');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Not Found</h1>
      <p className="text-gray-600 mb-8">
        The page you are looking for does not exist.
      </p>
      {!isLoggedIn && (
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Go to Login
        </button>
      )}
    </div>
  );
}
