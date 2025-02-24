import React, { useCallback } from 'react';

interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  requiresAuth?: boolean;
}

const navigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    href: '/app/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    ),
    requiresAuth: true
  },
  {
    label: 'Blueprints',
    href: '/app/blueprints',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    requiresAuth: true
  },
  {
    label: 'Collections',
    href: '/app/collections',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    requiresAuth: true
  },
  {
    label: 'Shop',
    href: '/app/shops',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    requiresAuth: true
  },
  {
    label: 'Settings',
    href: '/app/settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    requiresAuth: true
  }
];

export const Navigation: React.FC = () => {
  const isAuthenticated = true; // TODO: Replace with actual auth state

  const isActiveRoute = useCallback((href: string): boolean => {
    return window.location.pathname.startsWith(href);
  }, []);

  const handleNavigation = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    window.history.pushState({}, '', href);
    
    // Dispatch a navigation event so other components can react to route changes
    window.dispatchEvent(new CustomEvent('navigation', { 
      detail: { path: href } 
    }));
  }, []);

  const filteredItems = navigationItems.filter(item => 
    !item.requiresAuth || (item.requiresAuth && isAuthenticated)
  );

  return (
    <nav className="space-y-1">
      {filteredItems.map((item) => {
        const isActive = isActiveRoute(item.href);
        return (
          <a
            key={item.href}
            href={item.href}
            onClick={(e) => handleNavigation(e, item.href)}
            className={`
              flex items-center px-3 py-2 text-sm font-medium rounded-md
              transition-colors duration-150 ease-in-out
              ${isActive
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            {item.icon && (
              <span className={`mr-3 ${isActive ? 'text-gray-500' : 'text-gray-400'}`}>
                {item.icon}
              </span>
            )}
            <span className="truncate">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
};