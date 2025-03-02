# Declarative UI Patterns Guide

## Overview
This guide covers best practices for writing declarative UI components using TypeScript in our Next.js application. Following these patterns ensures consistency, type safety, and maintainable code across our applications.

## Table of Contents
- [Component Composition](#component-composition)
- [Props Typing](#props-typing)
- [State Management](#state-management)
- [Conditional Rendering](#conditional-rendering)
- [Component Organization](#component-organization)
- [Performance Optimization](#performance-optimization)

## Component Composition

### Basic Component Structure
```typescript
import { FC, ReactNode } from 'react'

interface CardProps {
  title: string
  children: ReactNode
  className?: string
}

export const Card: FC<CardProps> = ({ 
  title, 
  children, 
  className = '' 
}) => {
  return (
    <div className={`card ${className}`}>
      <h2 className="card-title">{title}</h2>
      <div className="card-content">
        {children}
      </div>
    </div>
  )
}
```

### Higher-Order Components (HOCs)
```typescript
import { ComponentType } from 'react'

export function withFeatureGuard<T extends object>(
  WrappedComponent: ComponentType<T>,
  featureKey: string
) {
  return function WithFeatureGuard(props: T) {
    const hasAccess = useFeatureCheck(featureKey)
    
    if (!hasAccess) {
      return <UpgradePrompt feature={featureKey} />
    }
    
    return <WrappedComponent {...props} />
  }
}
```

## Props Typing

### Union Types for Variants
```typescript
type ButtonVariant = 'primary' | 'secondary' | 'tertiary'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant: ButtonVariant
  size: ButtonSize
  label: string
  onClick?: () => void
  disabled?: boolean
}
```

### Generic Components
```typescript
interface DataListProps<T> {
  items: T[]
  renderItem: (item: T) => ReactNode
  keyExtractor: (item: T) => string
}

export function DataList<T>({ 
  items, 
  renderItem, 
  keyExtractor 
}: DataListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  )
}
```

## State Management

### Using useState with TypeScript
```typescript
interface FormState {
  email: string
  password: string
  rememberMe: boolean
}

function LoginForm() {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    password: '',
    rememberMe: false
  })

  const updateField = <K extends keyof FormState>(
    field: K, 
    value: FormState[K]
  ) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }))
  }
}
```

### Custom Hooks
```typescript
function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (product: Product, quantity: number) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === product.id)
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, quantity }]
    })
  }

  return { items, addItem }
}
```

## Conditional Rendering

### Type-Safe Conditional Components
```typescript
interface LoadingStateProps<T> {
  isLoading: boolean
  error?: Error
  data?: T
  children: (data: T) => ReactNode
}

function LoadingState<T>({ 
  isLoading, 
  error, 
  data, 
  children 
}: LoadingStateProps<T>) {
  if (isLoading) {
    return <Spinner />
  }

  if (error) {
    return <ErrorMessage message={error.message} />
  }

  if (!data) {
    return <EmptyState />
  }

  return <>{children(data)}</>
}
```

## Component Organization

### Feature-Based Structure
```typescript
// src/features/products/
├── components/
│   ├── ProductCard.tsx
│   ├── ProductList.tsx
│   └── ProductFilter.tsx
├── hooks/
│   ├── useProductSearch.ts
│   └── useProductFilter.ts
└── types/
    └── product.ts
```

### Shared Component Library
```typescript
// packages/shared-ui/components/
├── Button/
│   ├── Button.tsx
│   ├── Button.test.tsx
│   └── index.ts
├── Card/
│   ├── Card.tsx
│   ├── Card.test.tsx
│   └── index.ts
└── index.ts
```

## Performance Optimization

### Memoization
```typescript
import { memo } from 'react'

interface ExpensiveComponentProps {
  data: ComplexData
  onUpdate: (id: string) => void
}

export const ExpensiveComponent = memo(
  function ExpensiveComponent({ data, onUpdate }: ExpensiveComponentProps) {
    return (
      // Component implementation
    )
  },
  (prevProps, nextProps) => {
    return prevProps.data.id === nextProps.data.id
  }
)
```

### useCallback for Event Handlers
```typescript
function ProductList() {
  const handleDelete = useCallback((id: string) => {
    // Delete logic
  }, [])

  const handleUpdate = useCallback((id: string, data: ProductData) => {
    // Update logic
  }, [])

  return (
    <div>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  )
}
```

## Best Practices

1. Always define explicit types for component props
2. Use function declarations for components instead of arrow functions
3. Leverage TypeScript's type inference where possible
4. Keep components focused and single-responsibility
5. Use composition over inheritance
6. Implement proper error boundaries
7. Write unit tests for components
8. Document complex type definitions
9. Use constants for magic strings/numbers
10. Follow the project's established naming conventions

## Common Pitfalls to Avoid

1. Overusing `any` type
2. Neglecting prop type validation
3. Incorrect usage of generics
4. Poor state management patterns
5. Unnecessary component re-renders
6. Complex conditional rendering logic
7. Prop drilling
8. Inadequate error handling
9. Missing accessibility attributes
10. Inconsistent naming conventions

## Additional Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [React TypeScript Cheatsheet](https://github.com/typescript-cheatsheets/react)
- [Next.js Documentation](https://nextjs.org/docs)