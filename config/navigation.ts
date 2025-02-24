export interface NavigationItem {
  path: string;
  label: string;
  icon?: string;
  requiresAuth: boolean;
  children?: NavigationItem[];
}

export interface NavigationSection {
  label: string;
  items: NavigationItem[];
}

export interface Breadcrumb {
  label: string;
  path?: string;
}

export const navigationConfig: NavigationSection[] = [
  {
    label: 'Main',
    items: [
      {
        path: '/app/dashboard',
        label: 'Dashboard',
        requiresAuth: true,
      },
      {
        path: '/app/blueprints',
        label: 'Blueprints',
        requiresAuth: true,
      },
      {
        path: '/app/collections',
        label: 'Collections',
        requiresAuth: true,
      },
      {
        path: '/app/shops',
        label: 'Shops',
        requiresAuth: true,
      }
    ]
  },
  {
    label: 'System',
    items: [
      {
        path: '/app/settings',
        label: 'Settings',
        requiresAuth: true,
      },
      {
        path: '/app/analytics',
        label: 'Analytics',
        requiresAuth: true,
      }
    ]
  }
];

export const publicPaths = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/pricing',
  '/about',
  '/contact'
];

export const isPublicPath = (path: string): boolean => {
  return publicPaths.includes(path) || publicPaths.some(publicPath => 
    path.startsWith(publicPath + '/')
  );
};

export const getActiveNavigationItem = (currentPath: string): NavigationItem | null => {
  for (const section of navigationConfig) {
    for (const item of section.items) {
      if (currentPath.startsWith(item.path)) {
        return item;
      }
      if (item.children) {
        const childMatch = item.children.find(child => 
          currentPath.startsWith(child.path)
        );
        if (childMatch) {
          return childMatch;
        }
      }
    }
  }
  return null;
};

export const getBreadcrumbs = (currentPath: string): Breadcrumb[] => {
  const parts = currentPath.split('/').filter(Boolean);
  const breadcrumbs: Breadcrumb[] = [];
  let currentPathBuilder = '';

  for (const part of parts) {
    currentPathBuilder += `/${part}`;
    const navigationItem = getActiveNavigationItem(currentPathBuilder);
    
    if (navigationItem) {
      breadcrumbs.push({
        label: navigationItem.label,
        path: navigationItem.path
      });
    } else {
      // Add non-navigation path segments with a formatted label
      breadcrumbs.push({
        label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ')
      });
    }
  }

  return breadcrumbs;
};

export const getDefaultRedirectPath = (isAuthenticated: boolean): string => {
  return isAuthenticated ? '/app/dashboard' : '/auth/login';
};

// Helper to get all available paths for route matching
export const getAllPaths = (): string[] => {
  const paths: string[] = [...publicPaths];
  
  navigationConfig.forEach(section => {
    section.items.forEach(item => {
      paths.push(item.path);
      if (item.children) {
        item.children.forEach(child => paths.push(child.path));
      }
    });
  });

  return paths;
};
