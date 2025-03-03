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
        </div>
      </div>
    </div>
  );
}
