import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Sorry.. there was an error</h1>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: '10px 20px',
              marginTop: '20px',
              cursor: 'pointer'
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

function ErrorFallback({ error }: { error?: Error }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
      <p className="text-gray-500 mb-4 text-center max-w-md">
        {error?.message || 'An unexpected error occurred. Please try again later.'}
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => window.location.reload()} 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </button>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Home className="h-4 w-4 mr-2" />
          Return Home
        </button>
      </div>
    </div>
  );
}
