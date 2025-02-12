import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Palette, Package, TextSelection as Collection, Settings as SettingsIcon, LogOut, Store, Tags } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { useShop } from '../contexts/ShopContext';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { currentShop, shops, setCurrentShop } = useShop();

  const navigation = [
    { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
    { name: 'Brands', href: '/app/brands', icon: Tags },
    { name: 'Templates', href: '/app/templates', icon: Palette },
    { name: 'Designs', href: '/app/designs', icon: Palette },
    { name: 'Products', href: '/app/products', icon: Package },
    { name: 'Collections', href: '/app/collections', icon: Collection },
    { name: 'Settings', href: '/app/settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="flex flex-col h-16 px-6 py-3">
            <h1 className="text-xl font-bold text-gray-900">PrintVision.Cloud</h1>
            <div className="relative mt-2">
              <select
                value={currentShop?.id}
                onChange={(e) => {
                  const shop = shops.find((s) => s.id === e.target.value);
                  if (shop) setCurrentShop(shop);
                }}
                className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
              >
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <Store className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900',
                    (location.pathname === item.href || 
                     (item.href === '/app' && location.pathname === '/app')) && 
                     'bg-gray-100 text-gray-900'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={() => {
                signOut();
                navigate('/');
              }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 mt-auto"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <main className="p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
