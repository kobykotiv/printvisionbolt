import React from 'react';

interface LoadingScreenProps {
  message?: string;
  className?: string;
}

export function LoadingScreen({ 
  message = 'Loading...', 
  className = '' 
}: LoadingScreenProps) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${className}`}>
      {/* Animated Loading Spinner */}
      <div className="relative">
        <div className="w-12 h-12">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="w-12 h-12 rounded-full border-4 border-blue-200"></div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full animate-spin">
            <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        </div>
      </div>

      {/* Loading Message */}
      <p className="mt-4 text-sm text-gray-600 animate-pulse">
        {message}
      </p>

      {/* Development Mode Indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4">
          <div className="bg-gray-800 bg-opacity-75 text-white text-xs px-2 py-1 rounded-md">
            Loading Screen
          </div>
        </div>
      )}
    </div>
  );
}

// Specialized loading screens for different contexts
LoadingScreen.Page = function PageLoadingScreen(props: LoadingScreenProps) {
  return (
    <LoadingScreen
      {...props}
      className={`bg-gray-50 ${props.className || ''}`}
    />
  );
};

LoadingScreen.Modal = function ModalLoadingScreen(props: LoadingScreenProps) {
  return (
    <LoadingScreen
      {...props}
      className={`min-h-[200px] ${props.className || ''}`}
    />
  );
};

LoadingScreen.Inline = function InlineLoadingScreen(props: LoadingScreenProps) {
  return (
    <div className={`flex items-center space-x-2 ${props.className || ''}`}>
      <div className="w-4 h-4 relative">
        <div className="absolute top-0 left-0 w-full h-full animate-spin">
          <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
      <span className="text-sm text-gray-600">
        {props.message || 'Loading...'}
      </span>
    </div>
  );
};
