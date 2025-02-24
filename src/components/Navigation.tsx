import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navigation, userMenu } from '../lib/config/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useShop } from '../contexts/ShopContext';

export function Navigation() {
  const location = useLocation();
  const { user } = useAuth();
  const { currentShop } = useShop();
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Main Navigation */}
          <div className="flex">
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
 
              {navigation.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      isActive
                        ? 'border-b-2 border-indigo-500 text-gray-900'
                        : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user && (
              <>
                {currentShop && (
                  <span className="text-sm text-gray-500 mr-4">
                    Shop: {currentShop.name}
                  </span>
                )}
                {userMenu.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                        isActive
  ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <item.icon className="h-5 w-5 mr-2" />
                      {item.label}
                    </Link>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`${
                  isActive
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              >
                <div className="flex items-center">
                  <item.icon className="h-5 w-5 mr-2" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}