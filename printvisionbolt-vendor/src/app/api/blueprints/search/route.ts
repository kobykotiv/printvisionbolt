import type { Blueprint } from '../../../../lib/types/template';
import type { PodProvider } from '../../../../lib/types/pod';
import { blueprintService } from '../../../../lib/services/blueprintService';

// Simple in-memory cache
const cache = new Map<string, {
  data: Blueprint[];
  timestamp: number;
}>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MOCK_DELAY = 1000; // 1 second delay for mock data

interface SearchParams {
  provider?: PodProvider;
  query?: string;
  page?: number;
  limit?: number;
}

// Mock data for development
const mockBlueprints: Blueprint[] = [
  {
    id: 'pfy-ts-1',
    title: 'Classic T-Shirt',
    provider: 'printify',
    providerId: 'pfy-1',
    variants: [
      { id: 'v1', title: 'White / S', sku: 'TS-W-S', options: { color: 'White', size: 'S' } },
      { id: 'v2', title: 'White / M', sku: 'TS-W-M', options: { color: 'White', size: 'M' } }
    ],
    placeholders: [
      {
        id: 'front',
        name: 'Front Print',
        width: 12,
        height: 16,
        x: 0,
        y: 0,
        rotation: 0,
        required: true,
        constraints: {
          minDpi: 150,
          maxDpi: 300,
          allowedFormats: ['png', 'jpg']
        }
      }
    ],
    pricing: {
      baseCost: 15,
      retailPrice: 29.99
    }
  },
  {
    id: 'pfl-hd-1',
    title: 'Premium Hoodie',
    provider: 'printful',
    providerId: 'pfl-1',
    variants: [
      { id: 'v1', title: 'Black / S', sku: 'HD-B-S', options: { color: 'Black', size: 'S' } },
      { id: 'v2', title: 'Black / M', sku: 'HD-B-M', options: { color: 'Black', size: 'M' } }
    ],
    placeholders: [
      {
        id: 'front',
        name: 'Front Print',
        width: 14,
        height: 18,
        x: 0,
        y: 0,
        rotation: 0,
        required: true,
        constraints: {
          minDpi: 150,
          maxDpi: 300,
          allowedFormats: ['png', 'jpg']
        }
      }
    ],
    pricing: {
      baseCost: 25,
      retailPrice: 49.99
    }
  }
];

async function searchBlueprints(params: SearchParams): Promise<Blueprint[]> {
  const cacheKey = JSON.stringify(params);
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  // In a real app, make API calls to the respective providers
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

  let results = [...mockBlueprints];

  // Filter by provider
  if (params.provider) {
    results = results.filter(b => b.provider === params.provider);
  }

  // Filter by search query
  if (params.query) {
    const query = params.query.toLowerCase();
    results = results.filter(b => 
      b.title.toLowerCase().includes(query) ||
      b.variants.some(v => v.title.toLowerCase().includes(query))
    );
  }

  // Apply pagination
  const page = params.page || 1;
  const limit = params.limit || 20;
  const start = (page - 1) * limit;
  results = results.slice(start, start + limit);

  // Cache results
  cache.set(cacheKey, {
    data: results,
    timestamp: Date.now()
  });

  return results;
}

export async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const params: SearchParams = {
    provider: url.searchParams.get('provider') as PodProvider,
    query: url.searchParams.get('query') || undefined,
    page: parseInt(url.searchParams.get('page') || '1', 10),
    limit: parseInt(url.searchParams.get('limit') || '20', 10)
  };

  try {
    const apiKey = process.env.PROVIDER_API_KEY;
    if (!apiKey) {
      throw new Error('Missing provider API key');
    }

    const { results, pagination } = await blueprintService.searchBlueprints(params, apiKey);
    
    return new Response(JSON.stringify({
      results,
      pagination
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Blueprint search error:', error);
    
    return new Response(JSON.stringify({
      error: 'Failed to search blueprints'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

export const GET = handler;