'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GlassCard } from '@printvisionbolt/ui';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Products', href: '/products', icon: '📦' },
  { label: 'Orders', href: '/orders', icon: '🛍️' },
  { label: 'Customers', href: '/customers', icon: '👥' },
  { label: 'Analytics', href: '/analytics', icon: '📈' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <GlassCard className="h-full w-64 p-4 flex flex-col gap-2">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Vendor Portal</h2>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-gray-500/5 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/profile"
          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-500/5"
        >
          <span className="text-xl">👤</span>
          <span className="font-medium">Profile</span>
        </Link>
      </div>
    </GlassCard>
  );
}