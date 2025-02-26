import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth/AuthContext';

const NotFound: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-secondary-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary-600 dark:text-primary-500">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-secondary-900 dark:text-white">
          Page Not Found
        </h2>
        <p className="mt-2 text-secondary-500 dark:text-secondary-400">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
