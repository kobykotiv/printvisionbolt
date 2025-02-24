import React from 'react';
import { Button } from '../../components/ui/Button';
import { logger } from '../features/blueprints/utils/logger';

export function NotFound() {
  const handleGoHome = () => {
    logger.debug('404 page: User clicked go home', {
      from: window.location.pathname,
      timestamp: new Date().toISOString()
    });

    window.location.href = '/';
  };

  const handleGoBack = () => {
    logger.debug('404 page: User clicked go back', {
      from: window.location.pathname,
      timestamp: new Date().toISOString()
    });

    window.history.back();
  };

  React.useEffect(() => {
    logger.warn('404 page accessed', {
      path: window.location.pathname,
      timestamp: new Date().toISOString()
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="select-none">
          <div className="text-6xl sm:text-8xl font-bold text-blue-600 mb-4">404</div>
          <div className="relative">
            <svg
              className="absolute inset-0 h-full w-full text-gray-100"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <pattern
                id="404-pattern"
                width="52"
                height="52"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(25)"
              >
                <circle cx="2" cy="2" r="1" className="text-gray-200" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#404-pattern)" />
            </svg>
          </div>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 text-base text-gray-500 max-w-xl mx-auto">
          Sorry, we couldn't find the page you were looking for. The page might have been moved, 
          deleted, or might not exist.
        </p>

        <div className="mt-10 flex justify-center space-x-4">
          <Button
            variant="primary"
            label="Go back"
            onClick={handleGoBack}
            className="inline-flex items-center"
          >
            <svg
              className="mr-2 -ml-1 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Go back
          </Button>

          <Button
            variant="outline"
            label="Go home"
            onClick={handleGoHome}
            className="inline-flex items-center"
          >
            <svg
              className="mr-2 -ml-1 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go home
          </Button>
        </div>

        {/* Visual Easter Egg */}
        <div className="mt-16 select-none opacity-10 hover:opacity-20 transition-opacity">
          <div className="text-9xl font-mono text-gray-900 tracking-widest transform -rotate-12">
            ¯\_(ツ)_/¯
          </div>
        </div>
      </div>
    </div>
  );
}
