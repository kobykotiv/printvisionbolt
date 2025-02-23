import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { LoginWidget } from './auth/LoginWidget';
import { UserStats } from './user/UserStats';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  // If user is not authenticated, show login widget
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoginWidget />
      </div>
    );
  }

  // For authenticated users, show layout with navbar
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col h-screen">
        {/* Navigation */}
        <Navbar />

        {/* User Menu (top-right corner) */}
        <div className="absolute top-2 right-4 z-40 lg:z-30">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 text-sm hover:bg-gray-50 rounded-md p-2 bg-white"
            >
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <User className="h-4 w-4 text-indigo-600" />
              </div>
              <span className="text-gray-700 hidden sm:inline">{user.email}</span>
              <ChevronDown className={cn(
                "h-4 w-4 text-gray-400 transition-transform",
                showUserMenu && "transform rotate-180"
              )} />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                <button
                  onClick={() => {
                    signOut();
                    navigate('/');
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto pb-24">
          <main className="container mx-auto px-4 py-8 mt-4">
            {children}
          </main>
        </div>

        {/* Footer with User Stats */}
        <div className="fixed bottom-4 right-4 w-auto bg-transparent">
          <div className="mb-2">
            <UserStats />
          </div>
          <div className="bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
            <button
              onClick={() => {
                signOut();
                navigate('/');
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
