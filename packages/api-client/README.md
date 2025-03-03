# @printvisionbolt/api-client

A strongly-typed API client for PrintVision using tRPC and React Query.

## Installation

```bash
pnpm add @printvisionbolt/api-client
```

## Usage

### Setting up the Provider

Wrap your application with the `ApiProvider`:

```tsx
import { ApiProvider } from '@printvisionbolt/api-client';

function App() {
  return (
    <ApiProvider url="http://localhost:3001/api/trpc">
      <YourApp />
    </ApiProvider>
  );
}
```

### Using the Hooks

The package provides several hooks for common operations:

```tsx
import { useProducts, useOrders, useSession } from '@printvisionbolt/api-client';

function ProductList() {
  const { data: products, isLoading } = useProducts('your-store-id');

  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {products.items.map(product => (
        <div key={product.id}>{product.title}</div>
      ))}
    </div>
  );
}
```

### Available Hooks

- `useProducts(storeId)`: Fetch products for a store
- `useProduct(productId)`: Fetch a single product
- `useOrders(storeId)`: Fetch orders for a store
- `useOrder(orderId)`: Fetch a single order
- `useSession()`: Get the current session
- `useUser()`: Get the current user

### Custom Queries

You can also use the raw tRPC client for custom queries:

```tsx
import { useApi } from '@printvisionbolt/api-client';

function CustomComponent() {
  const api = useApi();
  const { data } = api.product.customQuery.useQuery(params);
  
  return <div>{/* Your component */}</div>;
}
```

## Type Safety

The client is fully typed with TypeScript, providing autocompletion and type checking for all API calls.

## Features

- 🔒 Type-safe API calls
- 🔄 Automatic request deduplication
- 📦 Built-in caching with React Query
- 🚀 Optimized for Next.js
- 💻 Full TypeScript support

## Contributing

See the main repository's contributing guide.