import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navigation, userMenu } from '../lib/config/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useShop } from '../contexts/ShopContext';
import { FreeUsageWidget } from './ui/FreeUsageWidget';
import { ErrorBoundary } from 'react-error-boundary';
import { Terminal } from './ui/Terminal';

export function Navigation() {
  const location = useLocation();
  const { user } = useAuth();
  const { currentShop } = useShop();
  const [terminalOutput, setTerminalOutput] = React.useState("");

  const renderNavLinks = (items, isMobile = false) => {
    return items.map((item) => {
      const isActive = location.pathname === item.path;
      return (
        <Link
          key={item.id}
          to={item.path}
          className={isMobile ? `${
            isActive
              ? "bg-indigo-50 border-indigo-500 text-indigo-700"
              : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
          } block pl-3 pr-4 py-2 border-l-4 text-base font-medium` :
          `inline-flex items-center px-1 pt-1 text-sm font-medium ${
            isActive
              ? "border-b-2 border-indigo-500 text-gray-900"
              : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center">
            <item.icon className="h-5 w-5 mr-2" />
            {item.label}
          </div>
        </Link>
      );
    });
  };

  return (
    <ErrorBoundary fallback={<div className="p-4">Navigation Error</div>}>
      <nav className="bg-white shadow-sm mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Main Navigation */}
            <div className="flex">
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {renderNavLinks(navigation)}
              </div>
            </div>

            {/* User Menu */}
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {currentShop?.name && (
                  <span className="text-sm text-gray-500 mr-4">
                    Shop: {currentShop.name}
                  </span>
                )}
                <FreeUsageWidget />
                {renderNavLinks(userMenu)}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {user && (
          <div className="sm:hidden">
            {currentShop?.name && (
              <div className="px-3 py-2 text-sm text-gray-500">
                Shop: {currentShop.name}
              </div>
            )}
            <div className="pt-2 pb-3 space-y-1">
              {renderNavLinks(navigation, true)}
              {renderNavLinks(userMenu, true)}
            </div>
            <div className="px-3 py-2">
              <FreeUsageWidget />
            </div>
          </div>
        )}
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Terminal output={terminalOutput} />
      </div>
    </ErrorBoundary>
  );
}