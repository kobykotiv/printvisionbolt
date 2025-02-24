import React, { useState, useEffect } from 'react';
import { Navigation } from '../../src/components/Navigation';
import { Button } from '../ui/Button';

interface NavigationMenuProps {
  className?: string;
}

export function NavigationMenu({ className = '' }: NavigationMenuProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Update current path when navigation occurs
  useEffect(() => {
    const handleNavigation = (event: Event) => {
      const customEvent = event as CustomEvent;
      setCurrentPath(customEvent.detail.path);
      setIsMobileMenuOpen(false); // Close mobile menu after navigation
    };

    window.addEventListener('navigation', handleNavigation);
    
    // Clean up
    return () => {
      window.removeEventListener('navigation', handleNavigation);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const menu = document.getElementById('mobile-menu');
      const button = document.getElementById('mobile-menu-button');

      if (menu && button && !menu.contains(target) && !button.contains(target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className={className}>
      {/* Desktop Navigation */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white">
          <Navigation />
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Button
          id="mobile-menu-button"
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -ml-1 rounded-md"
          aria-label="Open navigation menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </Button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            className="absolute left-0 right-0 z-50 p-2 mt-2 origin-top-left bg-white rounded-md shadow-lg"
          >
            <div className="p-2">
              <Navigation />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25 md:hidden"
          aria-hidden="true"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
