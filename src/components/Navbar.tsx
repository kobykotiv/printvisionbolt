import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { MobileNav } from './navigation/MobileNav';

const Navbar: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);

  return (
    <>
      <nav className="bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          {/* Mobile View */}
          <div className="flex items-center justify-between lg:hidden">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMobileNavOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-md"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="font-bold text-xl text-gray-800">
                PrintVision.Cloud
              </div>
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden lg:flex lg:items-center lg:justify-between">
            {/* Left side: Brand and main menu items */}
            <div className="flex items-center space-x-6">
              {/* Brand Logo/Name */}
              <div className="font-bold text-xl text-gray-800">
                PrintVision.Cloud
              </div>
              {/* Main Menu Items */}
              <Link to="/shop-selector" className="hover:text-blue-500">
                Shop Selector
              </Link>
              <Link to="/templates" className="hover:text-blue-500">
                Templates
              </Link>
              <Link to="/blueprints" className="hover:text-blue-500">
                Blueprints
              </Link>
              <Link to="/brand-assets" className="hover:text-blue-500">
                Brand Assets
              </Link>
              <Link to="/designs" className="hover:text-blue-500">
                Designs
              </Link>
              <Link to="/collections" className="hover:text-blue-500">
                Collections
              </Link>
              <Link to="/upload" className="hover:text-blue-500">
                Upload
              </Link>
              <Link to="/sync" className="hover:text-blue-500">
                Sync
              </Link>
              {/* Enterprise Features */}
              <Link to="/drops" className="hover:text-blue-500">
                Drops
              </Link>
              <Link to="/auto-sync" className="hover:text-blue-500">
                Auto Sync
              </Link>
              <Link to="/seasonal-sync" className="hover:text-blue-500">
                Seasonal Sync
              </Link>
            </div>
            {/* Right side: Additional options */}
            <div className="flex items-center space-x-4">
              <Link to="/analytics" className="hover:text-blue-500">
                Analytics
              </Link>
              <Link to="/notifications" className="hover:text-blue-500">
                Notifications
              </Link>
              <Link to="/settings" className="hover:text-blue-500">
                Settings
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </>
  );
};

export default Navbar;