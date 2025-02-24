# Blueprint Integration Project Structure

```
src/
├── features/
│   └── blueprints/
│       ├── api/
│       │   ├── printify.ts
│       │   ├── printful.ts
│       │   ├── gooten.ts
│       │   └── gelato.ts
│       ├── components/
│       │   ├── ProviderSelector/
│       │   │   ├── index.tsx
│       │   │   ├── ProviderCard.tsx
│       │   │   └── styles.module.css
│       │   ├── BlueprintCard/
│       │   │   ├── index.tsx
│       │   │   ├── PrintingOptions.tsx
│       │   │   └── styles.module.css
│       │   ├── SearchableProductGrid/
│       │   │   ├── index.tsx
│       │   │   ├── FilterPanel.tsx
│       │   │   └── styles.module.css
│       │   └── ProductDetails/
│       │       ├── index.tsx
│       │       ├── VariantSelector.tsx
│       │       ├── PricingCalculator.tsx
│       │       └── styles.module.css
│       ├── hooks/
│       │   ├── useBlueprints.ts
│       │   ├── useProviders.ts
│       │   └── useProductDetails.ts
│       ├── services/
│       │   ├── adapters/
│       │   │   ├── printifyAdapter.ts
│       │   │   ├── printfulAdapter.ts
│       │   │   ├── gootenAdapter.ts
│       │   │   └── gelatoAdapter.ts
│       │   ├── blueprintService.ts
│       │   ├── cacheService.ts
│       │   └── webhookService.ts
│       ├── types/
│       │   ├── blueprint.ts
│       │   ├── provider.ts
│       │   └── api.ts
│       └── utils/
│           ├── normalizers.ts
│           ├── validators.ts
│           └── errorHandlers.ts
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   └── rateLimiter.ts
│   ├── cache/
│   │   ├── redis.ts
│   │   └── strategies.ts
│   └── errors/
│       ├── ApiError.ts
│       └── ErrorBoundary.tsx
└── pages/
    └── app/
        └── blueprints/
            ├── index.tsx
            ├── [providerId]/
            │   └── index.tsx
            └── [providerId]/[blueprintId]/
                └── index.tsx
```

## Directory Structure Explanation

### /features/blueprints
Core blueprint feature module containing all related functionality.

#### /api
Provider-specific API integration code:
- Authentication
- Endpoint definitions
- Response types
- Request/response transformations

#### /components
React components organized by feature:
- ProviderSelector: UI for selecting print providers
- BlueprintCard: Card component for displaying blueprint summaries
- SearchableProductGrid: Main product browsing interface
- ProductDetails: Detailed product view components

#### /hooks
Custom React hooks:
- useBlueprints: Blueprint data management
- useProviders: Provider selection and management
- useProductDetails: Detailed product information handling

#### /services
Business logic and data management:
- adapters: Provider-specific data adapters
- blueprintService: Core blueprint management
- cacheService: Caching implementation
- webhookService: Webhook handling

#### /types
TypeScript type definitions:
- blueprint: Blueprint-related types
- provider: Provider-related types
- api: API-related types

#### /utils
Utility functions:
- normalizers: Data normalization
- validators: Data validation
- errorHandlers: Error handling utilities

### /lib
Shared utilities and services:
- api: Base API client and rate limiting
- cache: Redis configuration and caching strategies
- errors: Error handling utilities

### /pages
Next.js pages:
- /blueprints: Main blueprint listing
- /blueprints/[providerId]: Provider-specific listings
- /blueprints/[providerId]/[blueprintId]: Individual blueprint details

## Implementation Guidelines

1. Follow feature-first organization
2. Keep components focused and single-responsibility
3. Use proper TypeScript types throughout
4. Implement proper error boundaries
5. Use CSS modules for styling
6. Keep business logic in services
7. Use custom hooks for data management
8. Implement proper loading states
9. Use proper error handling
10. Follow accessibility guidelines

This structure provides:
- Clear separation of concerns
- Easy maintenance and scalability
- Consistent patterns across the feature
- Clear dependencies between modules
- Easy testing organization

Start implementation with core services and work outward to UI components.