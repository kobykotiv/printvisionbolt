import type { Blueprint } from '../types/template';
import type { PodProvider } from '../types/pod';

interface SearchParams {
  provider?: PodProvider;
  query?: string;
  page?: number;
  limit?: number;
}

interface SearchResponse {
  results: Blueprint[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

export class BlueprintService {
  private async fetchWithAuth(url: string, provider: PodProvider, apiKey: string): Promise<unknown> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    switch (provider) {
      case 'printify':
        headers.Authorization = `Bearer ${apiKey}`;
        break;
      case 'printful':
        headers.Authorization = `Bearer ${apiKey}`;
        break;
      case 'gooten':
        headers['X-API-Key'] = apiKey;
        break;
      case 'gelato':
        headers['X-API-KEY'] = apiKey;
        break;
    }

    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    return response.json();
  }

  async searchBlueprints(params: SearchParams, apiKey: string): Promise<SearchResponse> {
    const blueprints: Blueprint[] = [];
    let total = 0;

    if (!params.provider || params.provider === 'printify') {
      try {
        const data = await this.fetchWithAuth(
          'https://api.printify.com/v1/catalog/blueprints.json',
          'printify',
          apiKey
        ) as any;

        blueprints.push(...data.data.map((bp: any) => ({
          id: bp.id,
          title: bp.title,
          description: bp.description,
          provider: 'printify' as const,
          providerId: bp.id,
          variants: bp.variants.map((v: any) => ({
            id: v.id,
            title: v.title,
            sku: v.sku,
            options: v.options,
            pricing: {
              baseCost: v.cost,
              retailPrice: v.price
            }
          })),
          placeholders: bp.print_areas?.map((area: any) => ({
            id: area.id,
            name: area.title,
            width: area.width,
            height: area.height,
            x: 0,
            y: 0,
            rotation: 0,
            required: true,
            constraints: {
              minDpi: area.constraints?.min_dpi || 150,
              maxDpi: area.constraints?.max_dpi || 300,
              allowedFormats: area.constraints?.formats || ['PNG', 'JPG']
            }
          })) || [],
          pricing: {
            baseCost: bp.variants[0]?.cost || 0,
            retailPrice: bp.variants[0]?.price || 0
          }
        })));

        total += data.total || data.data.length;
      } catch (error) {
        console.error('Error fetching Printify blueprints:', error);
      }
    }

    if (!params.provider || params.provider === 'printful') {
      try {
        const data = await this.fetchWithAuth(
          'https://api.printful.com/products',
          'printful',
          apiKey
        ) as any;

        blueprints.push(...data.result.map((bp: any) => ({
          id: bp.id,
          title: bp.name,
          description: bp.description,
          provider: 'printful' as const,
          providerId: bp.id,
          variants: bp.variants.map((v: any) => ({
            id: v.id,
            title: v.name,
            sku: v.sku,
            options: v.options,
            pricing: {
              baseCost: v.cost,
              retailPrice: v.retail_price
            }
          })),
          placeholders: bp.print_details?.placement_areas?.map((area: any) => ({
            id: area.id,
            name: area.name,
            width: area.width,
            height: area.height,
            x: area.x || 0,
            y: area.y || 0,
            rotation: area.rotation || 0,
            required: true,
            constraints: {
              minDpi: 150,
              maxDpi: 300,
              allowedFormats: ['PNG', 'JPG']
            }
          })) || [],
          pricing: {
            baseCost: bp.variants[0]?.cost || 0,
            retailPrice: bp.variants[0]?.retail_price || 0
          }
        })));

        total += data.total || data.result.length;
      } catch (error) {
        console.error('Error fetching Printful blueprints:', error);
      }
    }

    if (!params.provider || params.provider === 'gooten') {
      try {
        const data = await this.fetchWithAuth(
          'https://api.gooten.com/v2/products',
          'gooten',
          apiKey
        ) as any;

        blueprints.push(...data.map((bp: any) => ({
          id: bp.id,
          title: bp.name,
          description: bp.description,
          provider: 'gooten' as const,
          providerId: bp.id,
          variants: bp.variants.map((v: any) => ({
            id: v.id,
            title: v.name,
            sku: v.sku,
            options: v.options,
            pricing: {
              baseCost: v.price * 0.7, // Estimated cost
              retailPrice: v.price
            }
          })),
          placeholders: bp.printAreas.map((area: any) => ({
            id: area.id,
            name: area.name,
            width: area.width,
            height: area.height,
            x: area.x,
            y: area.y,
            rotation: area.rotation,
            required: true,
            constraints: {
              minDpi: 150,
              maxDpi: 300,
              allowedFormats: ['PNG', 'JPG']
            }
          })),
          pricing: {
            baseCost: bp.variants[0]?.price * 0.7 || 0,
            retailPrice: bp.variants[0]?.price || 0
          }
        })));

        total += data.length;
      } catch (error) {
        console.error('Error fetching Gooten blueprints:', error);
      }
    }

    // Filter results
    let filtered = blueprints;

    if (params.query) {
      const query = params.query.toLowerCase();
      filtered = filtered.filter(bp =>
        bp.title.toLowerCase().includes(query) ||
        bp.description?.toLowerCase().includes(query)
      );
    }

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 20;
    const start = (page - 1) * limit;
    const results = filtered.slice(start, start + limit);

    return {
      results,
      pagination: {
        page,
        limit,
        total: filtered.length
      }
    };
  }

  async getBlueprint(id: string, provider: PodProvider, apiKey: string): Promise<Blueprint> {
    let endpoint = '';
    
    switch (provider) {
      case 'printify':
        endpoint = `https://api.printify.com/v1/catalog/blueprints/${id}.json`;
        break;
      case 'printful':
        endpoint = `https://api.printful.com/products/${id}`;
        break;
      case 'gooten':
        endpoint = `https://api.gooten.com/v2/products/${id}`;
        break;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }

    const data = await this.fetchWithAuth(endpoint, provider, apiKey);
    const bp = provider === 'printful' ? (data as any).result : data;

    return {
      id: bp.id,
      title: provider === 'printful' ? bp.name : bp.title,
      description: bp.description,
      provider,
      providerId: bp.id,
      variants: bp.variants.map((v: any) => ({
        id: v.id,
        title: provider === 'printful' ? v.name : v.title,
        sku: v.sku,
        options: v.options,
        pricing: {
          baseCost: v.cost || (v.price * 0.7),
          retailPrice: v.retail_price || v.price
        }
      })),
      placeholders: (provider === 'printful' ? bp.print_details?.placement_areas : 
                    provider === 'printify' ? bp.print_areas :
                    bp.printAreas)?.map((area: any) => ({
        id: area.id,
        name: provider === 'printful' ? area.name : area.title,
        width: area.width,
        height: area.height,
        x: area.x || 0,
        y: area.y || 0,
        rotation: area.rotation || 0,
        required: true,
        constraints: {
          minDpi: area.constraints?.min_dpi || 150,
          maxDpi: area.constraints?.max_dpi || 300,
          allowedFormats: area.constraints?.formats || ['PNG', 'JPG']
        }
      })) || [],
      pricing: {
        baseCost: bp.variants[0]?.cost || (bp.variants[0]?.price * 0.7) || 0,
        retailPrice: bp.variants[0]?.retail_price || bp.variants[0]?.price || 0
      }
    };
  }
}

export const blueprintService = new BlueprintService();