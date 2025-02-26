import React, { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  ShoppingBag,
  BoxIcon,
  Store,
  FolderTree,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../contexts/auth/AuthContext';

// Navigation items for the sidebar
const navigationItems = [
  { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
  {
    name: 'Content',
    items: [
      { name: 'Collections', href: '/app/collections', icon: FolderTree },
      { name: 'Designs', href: '/app/designs', icon: Image },
      { name: 'Templates', href: '/app/templates', icon: BoxIcon }
    ]
  },
  {
    name: 'POD Management',
    items: [
      { name: 'Stores', href: '/app/stores', icon: Store },
      { name: 'Products', href: '/app/products', icon: ShoppingBag },
      { name: 'Scheduled Drops', href: '/app/drops', icon: Calendar },
      { name: 'Sync Status', href: '/app/sync', icon: RefreshCw }
    ]
  },
  { name: 'Settings', href: '/app/settings', icon: Settings }
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <span className="text-2xl font-bold text-indigo-600">PrintVision</span>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="h-6 w-6" />
            </button>
          </div>
          <MobileNavigation />
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex h-16 items-center px-4">
            <span className="text-2xl font-bold text-indigo-600">PrintVision</span>
          </div>
          <DesktopNavigation />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 lg:hidden">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          <div className="flex flex-1 justify-end px-4">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="relative">
                <button 
                  className="flex items-center rounded-full bg-white p-1 text-sm focus:outline-none"
                >
                  <span className="mr-2 text-gray-700">{user?.email}</span>
                  <User className="h-8 w-8 rounded-full bg-gray-100 p-1" />
                </button>
              </div>
              <button
                onClick={handleSignOut}
                className="ml-3 rounded-md bg-white p-2 text-gray-400 hover:text-gray-500"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

interface NavItem {
  name: string;
  href?: string;
  icon?: LucideIcon;
  items?: NavItem[];
}

const NavLink = ({ item }: { item: NavItem }) => {
  if (!item.href || !item.icon) return null;
  const Icon = item.icon;
  return (
    <Link
      key={item.name}
      to={item.href}
      className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
    >
      <Icon className="mr-3 h-6 w-6 flex-shrink-0" />
      {item.name}
    </Link>
  );
};

const NavSection = ({ item }: { item: NavItem }) => {
  if (!item.items) return <NavLink item={item} />;
  
  return (
    <div className="space-y-1">
      <h3 className="px-2 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {item.name}
      </h3>
      <div className="space-y-1">
        {item.items.map((subItem) => (
          <NavLink key={subItem.name} item={subItem} />
        ))}
      </div>
    </div>
  );
};

const DesktopNavigation = () => (
  <nav className="mt-5 flex-1 space-y-1 px-2">
    {navigationItems.map((item) => (
      <NavSection key={item.name} item={item} />
    ))}
  </nav>
);

const MobileNavigation = () => (
  <nav className="mt-5 flex-1 space-y-1 px-2">
    {navigationItems.map((item) => (
      <NavSection key={item.name} item={item} />
    ))}
  </nav>
);

export default DashboardLayout;
