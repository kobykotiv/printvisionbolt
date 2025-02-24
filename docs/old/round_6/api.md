# Blueprint API Forwarding – Design & Implementation Guide

## Overview

In our PrintVision.Cloud platform, blueprints are sourced as read-only data from supplier APIs. Rather than maintaining a separate editable blueprint store, our system forwards GET requests to the appropriate supplier API (e.g., Printify, Printful, Gooten) to retrieve the most up-to-date blueprint information.  
 
For endpoints that traditionally would modify data (POST, PUT, DELETE), our API will either disable these operations or simulate them (e.g., caching) since supplier blueprints are read-only. This document outlines the API boundaries and provides code examples for forwarding requests.

## API Endpoints for Blueprints

| HTTP Method | Endpoint                   | Description                                                          |
|-------------|----------------------------|----------------------------------------------------------------------|
| GET         | `/api/v1/blueprints/:id`   | Retrieve blueprint details by forwarding the request to the supplier API based on supplier type |
| POST        | `/api/v1/blueprints`       | Not allowed (blueprints are read-only); optionally, simulate local creation for caching |
| PUT         | `/api/v1/blueprints/:id`   | Not allowed (blueprints cannot be updated)                           |
| DELETE      | `/api/v1/blueprints/:id`   | Not allowed (blueprints cannot be deleted)                           |

## Forwarding Logic

**Key Points:**
- **Read-only Access:**  
  Blueprints come from external suppliers and should not be modified via our API.
  
- **Supplier Determination:**  
  The request must include a parameter (e.g., `supplier` query parameter) that identifies which supplier's API to forward the request to.
  
- **Caching (Optional):**  
  Consider caching supplier responses for performance, but always allow forced refresh if needed.

## Example: Forwarding GET /api/v1/blueprints/:id

Below is an example implementation using Express and Axios that forwards the GET request to the appropriate supplier API:

```typescript
// controllers/blueprintController.ts
import { Request, Response } from 'express';
import axios from 'axios';

interface SupplierAPI {
  url: string;
  apiKey?: string;
}

// Mapping suppliers to their blueprint endpoint configuration
const supplierAPIs: Record<string, SupplierAPI> = {
  printify: {
    url: 'https://api.printify.com/v1/catalog/blueprints/',
    // apiKey can be set via environment variables if required
  },
  printful: {
    url: 'https://api.printful.com/products', // Example endpoint for Printful products
  },
  gooten: {
    url: 'https://www.gooten.com/api/v1/products', // Adjust endpoint as per documentation
  },
  // Add more suppliers as needed
};

export const getBlueprint = async (req: Request, res: Response) => {
  const { id } = req.params;
  // Expect a query parameter ?supplier=printify (for example)
  const supplier = req.query.supplier as string;

  if (!supplier || !supplierAPIs[supplier]) {
    return res.status(400).json({ error: 'Invalid or missing supplier parameter.' });
  }

  const supplierAPI = supplierAPIs[supplier];
  const endpoint = `${supplierAPI.url}${id}`;

  try {
    // Forward GET request to the supplier API
    const response = await axios.get(endpoint, {
      headers: supplierAPI.apiKey ? { 'X-API-KEY': supplierAPI.apiKey } : {},
    });
    res.status(200).json(response.data);
  } catch (error: any) {
    console.error(`Error fetching blueprint from ${supplier}:`, error.message);
    res.status(500).json({ error: `Error fetching blueprint from ${supplier}.` });
  }
};
```

Setting Up the Route

```typescript
// routes/blueprintRoutes.ts
import { Router } from 'express';
import { getBlueprint } from '../controllers/blueprintController';

const router = Router();

// GET /api/v1/blueprints/:id?supplier=printify
router.get('/:id', getBlueprint);

// Optional: Disable POST, PUT, DELETE for blueprints
router.post('/', (req, res) => res.status(405).json({ error: 'Method Not Allowed' }));
router.put('/:id', (req, res) => res.status(405).json({ error: 'Method Not Allowed' }));
router.delete('/:id', (req, res) => res.status(405).json({ error: 'Method Not Allowed' }));

export default router;
```

Integration into Express App

```typescript
// server.ts
import express from 'express';
import blueprintRoutes from './routes/blueprintRoutes';

const app = express();

app.use(express.json());

// Mount the blueprint API routes
app.use('/api/v1/blueprints', blueprintRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

```

Additional Considerations
Token Authentication:
All requests must include a valid token. Implement middleware to verify the token before forwarding the request.

Error Handling & Retries:
Include logic to handle transient errors and possibly retry requests if a supplier API temporarily fails.

Caching:
Optionally cache supplier responses to reduce API load and improve response times. Use a library like node-cache or Redis for caching.

Extensibility:
As new supplier APIs are integrated, add their configuration to the supplierAPIs mapping and adjust endpoints accordingly.

Conclusion
This API layer is designed to allow premium users to interact programmatically with our platform's blueprint data while ensuring that the supplier data remains authoritative and read-only. The forwarding mechanism enables real-time retrieval from external APIs, while built-in error handling and potential caching improve performance and reliability.

Prepared by the PrintVision.Cloud development team.




```typescript
// src/components/BlueprintFilter.tsx
import React, { useState } from 'react';

interface Supplier {
  id: string;
  name: string;
  apiStatus: 'online' | 'offline' | 'degraded';
}

// Mock supplier data; in production, fetch this from your config/API
const suppliers: Supplier[] = [
  { id: 'printify', name: 'Printify', apiStatus: 'online' },
  { id: 'printful', name: 'Printful', apiStatus: 'online' },
  { id: 'gooten', name: 'Gooten', apiStatus: 'offline' },
  { id: 'gelato', name: 'Gelato', apiStatus: 'degraded' }
];

const getStatusColor = (status: 'online' | 'offline' | 'degraded'): string => {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'offline':
      return 'bg-red-500';
    case 'degraded':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
};

const BlueprintFilter: React.FC = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<string>(suppliers[0].id);

  const handleSupplierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSupplier(e.target.value);
  };

  const currentSupplier = suppliers.find(s => s.id === selectedSupplier);

  return (
    <div className="p-4 border rounded shadow-md">
      <h3 className="text-xl font-bold mb-2">Select Supplier</h3>
      <div className="flex items-center space-x-4">
        <select
          value={selectedSupplier}
          onChange={handleSupplierChange}
          className="border p-2 rounded"
        >
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
        {currentSupplier && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">API Status:</span>
            <div className={`w-3 h-3 rounded-full ${getStatusColor(currentSupplier.apiStatus)}`}></div>
            <span className="text-sm">{currentSupplier.apiStatus.toUpperCase()}</span>
          </div>
        )}
      </div>
      {/* Additional filtering controls (e.g., search input, category filters) can be added here */}
    </div>
  );
};

export default BlueprintFilter;

```