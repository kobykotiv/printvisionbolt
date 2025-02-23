# PrintVision.Cloud Navigation Structure

## Layout Components

### Main Navigation Bar
```typescript
// src/components/navigation/Navbar.tsx
interface NavbarProps {
  user: User;
  onSignOut: () => void;
}

export function Navbar({ user, onSignOut }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Logo />
        <NavLinks />
        <UserMenu user={user} />
      </div>
    </nav>
  );
}
```

### Navigation Links
```typescript
// src/components/navigation/NavLinks.tsx
const navigationItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: HomeIcon,
  },
  {
    label: 'Shops',
    path: '/shops',
    icon: StoreIcon,
  },
  {
    label: 'Templates',
    path: '/templates',
    icon: TemplateIcon,
  },
  {
    label: 'Designs',
    path: '/designs',
    icon: PaletteIcon,
  },
  {
    label: 'Collections',
    path: '/collections',
    icon: FolderIcon,
  },
  {
    label: 'Sync',
    path: '/sync',
    icon: RefreshIcon,
    children: [
      { label: 'Manual Sync', path: '/sync/manual' },
      { label: 'Auto Sync', path: '/sync/auto' },
      { label: 'Seasonal Sync', path: '/sync/seasonal' },
    ]
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: ChartIcon,
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: SettingsIcon,
  }
];
```

## Page Components

### Dashboard Page
```typescript
// src/pages/Dashboard.tsx
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <ShopOverview />
      <RecentActivity />
      <QuickActions />
    </div>
  );
}
```

### Shops Page
```typescript
// src/pages/Shops.tsx
export default function ShopsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Your Shops</h1>
      <ShopSelector />
      <ShopGrid />
    </div>
  );
}
```

### Templates Page
```typescript
// src/pages/Templates.tsx
export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Templates</h1>
      <TemplateFilters />
      <TemplateList />
    </div>
  );
}
```

### Designs Page
```typescript
// src/pages/Designs.tsx
export default function DesignsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Designs</h1>
      <DesignUploader />
      <DesignGallery />
    </div>
  );
}
```

### Collections Page
```typescript
// src/pages/Collections.tsx
export default function CollectionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Collections</h1>
      <CollectionTree />
      <CollectionGrid />
    </div>
  );
}
```

### Sync Pages
```typescript
// src/pages/sync/ManualSync.tsx
export default function ManualSyncPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manual Sync</h1>
      <SyncControls />
      <SyncHistory />
    </div>
  );
}

// src/pages/sync/AutoSync.tsx
export default function AutoSyncPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Auto Sync</h1>
      <AutoSyncSettings />
      <SyncSchedule />
    </div>
  );
}
```

### Analytics Page
```typescript
// src/pages/Analytics.tsx
export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <PerformanceMetrics />
      <SyncStats />
      <UsageReports />
    </div>
  );
}
```

### Settings Page
```typescript
// src/pages/Settings.tsx
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <AccountSettings />
      <NotificationSettings />
      <IntegrationSettings />
    </div>
  );
}
```

## Logout Button Implementation

```typescript
// src/components/LogoutButton.tsx
interface LogoutButtonProps {
  onSignOut: () => Promise<void>;
}

export function LogoutButton({ onSignOut }: LogoutButtonProps) {
  return (
    <button
      onClick={onSignOut}
      className="fixed bottom-4 right-4 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
    >
      <LogOutIcon className="h-5 w-5 text-gray-600" />
    </button>
  );
}

// src/components/Layout.tsx
export function Layout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16 pb-20 px-4">
        <div className="container mx-auto">
          {children}
        </div>
      </main>
      <LogoutButton 
        onSignOut={async () => {
          await signOut();
          router.push('/login');
        }} 
      />
    </div>
  );
}
```

## Route Configuration

```typescript
// src/routes.tsx
export const routes = [
  {
    path: '/',
    element: <DashboardPage />,
    protected: true,
  },
  {
    path: '/shops',
    element: <ShopsPage />,
    protected: true,
  },
  {
    path: '/templates',
    element: <TemplatesPage />,
    protected: true,
  },
  {
    path: '/designs',
    element: <DesignsPage />,
    protected: true,
  },
  {
    path: '/collections',
    element: <CollectionsPage />,
    protected: true,
  },
  {
    path: '/sync',
    children: [
      {
        path: 'manual',
        element: <ManualSyncPage />,
      },
      {
        path: 'auto',
        element: <AutoSyncPage />,
      },
      {
        path: 'seasonal',
        element: <SeasonalSyncPage />,
      },
    ],
    protected: true,
  },
  {
    path: '/analytics',
    element: <AnalyticsPage />,
    protected: true,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
    protected: true,
  },
];
```

## Navigation Context

```typescript
// src/contexts/NavigationContext.tsx
interface NavigationContextValue {
  currentPath: string;
  navigate: (path: string) => void;
  isNavOpen: boolean;
  toggleNav: () => void;
}

export const NavigationContext = createContext<NavigationContextValue>({
  currentPath: '/',
  navigate: () => {},
  isNavOpen: false,
  toggleNav: () => {},
});

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const router = useRouter();

  return (
    <NavigationContext.Provider
      value={{
        currentPath: router.pathname,
        navigate: router.push,
        isNavOpen,
        toggleNav: () => setIsNavOpen(!isNavOpen),
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}