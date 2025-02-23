import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const menuItems = [
    { path: '/shop-selector', label: 'Shop Selector' },
    { path: '/templates', label: 'Templates' },
    { path: '/blueprints', label: 'Blueprints' },
    { path: '/brand-assets', label: 'Brand Assets' },
    { path: '/designs', label: 'Designs' },
    { path: '/collections', label: 'Collections' },
    { path: '/upload', label: 'Upload' },
    { path: '/sync', label: 'Sync' },
    { path: '/drops', label: 'Drops', enterprise: true },
    { path: '/auto-sync', label: 'Auto Sync', enterprise: true },
    { path: '/seasonal-sync', label: 'Seasonal Sync', enterprise: true },
    { path: '/analytics', label: 'Analytics' },
    { path: '/notifications', label: 'Notifications' },
    { path: '/settings', label: 'Settings' },
  ];

  return (
    <div
      className={cn(
        'fixed inset-0 bg-gray-900 bg-opacity-95 z-50 transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <div className="flex flex-col h-full text-white p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">PrintVision.Cloud</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1">
          <div className="grid gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'text-lg py-2 px-4 rounded-lg transition-colors',
                  'hover:bg-gray-800 active:bg-gray-700',
                  item.enterprise && 'text-indigo-400'
                )}
              >
                {item.label}
                {item.enterprise && (
                  <span className="ml-2 text-xs bg-indigo-600 px-2 py-1 rounded-full">
                    Enterprise
                  </span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400 text-center">
            © 2025 PrintVision.Cloud
          </p>
        </div>
      </div>
    </div>
  );
};