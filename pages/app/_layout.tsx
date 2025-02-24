import React from 'react';
import { NavigationMenu } from '../../components/layout/NavigationMenu';
import { logger } from '../../src/features/blueprints/utils/logger';
import { useDebugMode } from '../../src/features/blueprints/hooks/useDebugMode';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isDebugMode } = useDebugMode();

  // Log page view in debug mode
  React.useEffect(() => {
    if (isDebugMode) {
      logger.debug('Page view', {
        path: window.location.pathname,
        timestamp: new Date().toISOString()
      });
    }
  }, [isDebugMode]);

  // Handle navigation events
  React.useEffect(() => {
    const handleNavigationEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (isDebugMode) {
        logger.debug('Navigation occurred', {
          to: customEvent.detail.path,
          timestamp: new Date().toISOString()
        });
      }
    };

    window.addEventListener('navigation', handleNavigationEvent);
    return () => window.removeEventListener('navigation', handleNavigationEvent);
  }, [isDebugMode]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col h-0 flex-1">
              <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white border-b">
                <img
                  className="h-8 w-auto"
                  src="/logo.svg"
                  alt="Application logo"
                />
              </div>
              <div className="flex-1 flex flex-col overflow-y-auto">
                <NavigationMenu />
              </div>
              {/* Debug Mode Indicator */}
              {isDebugMode && (
                <div className="p-4 bg-blue-50 border-t border-blue-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-700">Debug Mode</span>
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          {/* Mobile Header */}
          <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white border-b">
            <button
              type="button"
              className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => {
                // Mobile menu state is handled in NavigationMenu component
                const event = new CustomEvent('toggleMobileMenu');
                window.dispatchEvent(event);
              }}
            >
              <span className="sr-only">Open navigation menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Page Content */}
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
