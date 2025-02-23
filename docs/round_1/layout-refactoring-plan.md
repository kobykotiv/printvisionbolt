# Layout Component Refactoring Plan

## Current Issues

1. **Duplicate Layout Logic**
   - Two separate layout components with overlapping functionality
   - Duplicated authentication checks
   - Similar user menu implementations
   - Redundant responsive design patterns

2. **Mixed Responsibilities**
   - Authentication logic mixed with layout concerns
   - Direct navigation handling in components
   - Inline style definitions
   - Tightly coupled user interface elements

3. **Maintainability Concerns**
   - No shared configuration for navigation items
   - Hardcoded layout dimensions
   - Limited component composition
   - Lack of layout variants

## Proposed Solution

### 1. Create Base Layout Components

```typescript
// src/shared/layouts/BaseLayout.tsx
interface BaseLayoutProps {
  children: React.ReactNode;
  navbar?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
}

export function BaseLayout({ 
  children, 
  navbar, 
  sidebar, 
  footer 
}: BaseLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col h-screen">
        {navbar}
        <div className="flex flex-1 overflow-hidden">
          {sidebar}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
        {footer}
      </div>
    </div>
  );
}
```

### 2. Extract Navigation Components

```typescript
// src/shared/components/navigation/NavItem.tsx
interface NavItemProps {
  id: string;
  label: string;
  icon: LucideIcon;
  depth?: number;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function NavItem({
  id,
  label,
  icon: Icon,
  depth = 0,
  isExpanded,
  onToggle
}: NavItemProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md",
        depth > 0 && "ml-4"
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="flex-1 text-left">{label}</span>
      {onToggle && (
        <ChevronRight
          className={cn(
            "h-4 w-4 transition-transform",
            isExpanded && "transform rotate-90"
          )}
        />
      )}
    </button>
  );
}
```

### 3. Create Authentication Wrapper

```typescript
// src/shared/components/auth/AuthenticatedLayout.tsx
interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoginWidget />
      </div>
    );
  }
  
  return children;
}
```

### 4. Implement Layout Variants

```typescript
// src/shared/layouts/DashboardLayout.tsx
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthenticatedLayout>
      <BaseLayout
        navbar={<Navbar />}
        footer={<UserStats />}
      >
        <div className="container mx-auto px-4 py-8 mt-4">
          {children}
        </div>
      </BaseLayout>
    </AuthenticatedLayout>
  );
}

// src/shared/layouts/CMSLayout.tsx
export function CMSLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthenticatedLayout>
      <BaseLayout
        sidebar={<CMSSidebar />}
      >
        {children}
      </BaseLayout>
    </AuthenticatedLayout>
  );
}
```

## Implementation Steps

1. **Phase 1: Core Components**
   - Create BaseLayout component
   - Extract navigation components
   - Implement AuthenticatedLayout wrapper
   - Set up layout context for shared state

2. **Phase 2: Layout Variants**
   - Implement DashboardLayout
   - Implement CMSLayout
   - Create specialized layout components as needed
   - Add layout-specific features

3. **Phase 3: Migration**
   - Update existing pages to use new layouts
   - Remove old layout components
   - Clean up unused imports and styles
   - Validate layout consistency

4. **Phase 4: Enhancement**
   - Add responsive design improvements
   - Implement layout transitions
   - Add layout customization options
   - Enhance accessibility

## Migration Strategy

### Step 1: Preparation
```typescript
// Create new layout components without removing old ones
// Add feature flag for new layouts
const USE_NEW_LAYOUTS = process.env.NEXT_PUBLIC_USE_NEW_LAYOUTS === 'true';

export function PageWrapper({ children }: { children: React.ReactNode }) {
  if (USE_NEW_LAYOUTS) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }
  return <Layout>{children}</Layout>;
}
```

### Step 2: Gradual Migration
```typescript
// Update one page at a time
export function ProductsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1>Products</h1>
        <ProductList />
      </div>
    </DashboardLayout>
  );
}
```

### Step 3: Cleanup
- Remove feature flags
- Delete old layout components
- Update documentation
- Remove unused dependencies

## Testing Requirements

1. **Unit Tests**
```typescript
describe('BaseLayout', () => {
  it('renders children correctly', () => {
    render(
      <BaseLayout>
        <div data-testid="content">Content</div>
      </BaseLayout>
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });
});
```

2. **Integration Tests**
```typescript
describe('DashboardLayout', () => {
  it('redirects to login when unauthenticated', () => {
    render(<DashboardLayout>Content</DashboardLayout>);
    expect(screen.getByTestId('login-widget')).toBeInTheDocument();
  });
});
```

## Performance Considerations

1. **Code Splitting**
   - Lazy load layout variants
   - Defer non-critical layout features
   - Optimize component imports

2. **State Management**
   - Minimize layout-level state
   - Use layout context efficiently
   - Cache layout configurations

## Accessibility Improvements

1. **Semantic HTML**
   - Use proper heading hierarchy
   - Add ARIA landmarks
   - Implement keyboard navigation

2. **Focus Management**
   - Trap focus in modals
   - Maintain focus on route changes
   - Add skip links

## Documentation Updates

1. **Component API**
   - Document layout props
   - Provide usage examples
   - Add accessibility guidelines

2. **Migration Guide**
   - Step-by-step migration instructions
   - Breaking changes list
   - Troubleshooting guide

## Next Steps

1. Create BaseLayout component
2. Set up testing infrastructure
3. Implement first layout variant
4. Begin gradual migration