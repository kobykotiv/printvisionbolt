import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';

interface LandingLayoutProps {
  children: React.ReactNode;
}

export function LandingLayout({ children }: LandingLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const { loginAsDemo } = useAuth();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleDemoLogin = async (type: 'free' | 'enterprise') => {
    try {
      await loginAsDemo(type);
      navigate('/dashboard');
    } catch (error) {
      console.error('Demo login failed:', error);
    }
  };

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-secondary-900">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 dark:bg-secondary-900/80 backdrop-blur-sm z-50 border-b border-secondary-200 dark:border-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-primary-600 dark:text-primary-400 text-xl font-bold">
                  PrintVision.Cloud
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-secondary-500 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md text-secondary-500 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white"
              >
                {isDarkMode ? '🌞' : '🌙'}
              </button>
              <Link
                to="/auth/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                Sign In
              </Link>
              <Link
                to="/auth/signup"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-primary-50 hover:bg-primary-100 dark:text-primary-400 dark:bg-secondary-800 dark:hover:bg-secondary-700"
              >
                Start Free
              </Link>
            </div>

            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-secondary-500 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {isOpen && (
            <div className="sm:hidden">
              <div className="pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block pl-3 pr-4 py-2 text-base font-medium text-secondary-500 hover:text-secondary-900 hover:bg-secondary-50 dark:text-secondary-400 dark:hover:text-white dark:hover:bg-secondary-800"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="pt-16">{children}</main>

      {/* Footer */}
      <footer className="bg-white dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-secondary-900 dark:text-white uppercase tracking-wider">
                Features
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-secondary-500 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white">
                    Templates
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-secondary-500 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white">
                    Auto-Sync
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-secondary-500 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white">
                    API Access
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-secondary-900 dark:text-white uppercase tracking-wider">
                Resources
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-secondary-500 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-secondary-500 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-secondary-500 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white">
                    Guides
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-secondary-900 dark:text-white uppercase tracking-wider">
                Company
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a href="#" className="text-base text-secondary-500 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-secondary-500 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-base text-secondary-500 hover:text-secondary-900 dark:text-secondary-400 dark:hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-secondary-900 dark:text-white uppercase tracking-wider">
                Try Demo
              </h3>
              <div className="mt-4 space-y-4">
                <button
                  onClick={() => handleDemoLogin('free')}
                  className="w-full text-left px-4 py-2 text-sm font-medium rounded-md bg-secondary-100 hover:bg-secondary-200 dark:bg-secondary-800 dark:hover:bg-secondary-700 text-secondary-900 dark:text-white transition-colors"
                >
                  Try Free Demo
                </button>
                <button
                  onClick={() => handleDemoLogin('enterprise')}
                  className="w-full text-left px-4 py-2 text-sm font-medium rounded-md bg-primary-50 hover:bg-primary-100 dark:bg-primary-900 dark:hover:bg-primary-800 text-primary-900 dark:text-primary-100 transition-colors"
                >
                  Try Enterprise Demo
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-secondary-200 dark:border-secondary-800 pt-8">
            <p className="text-base text-secondary-400 dark:text-secondary-500">
              © 2025 PrintVision.Cloud. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}