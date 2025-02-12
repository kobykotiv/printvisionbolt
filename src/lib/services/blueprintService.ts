import { supabase } from '../supabase';
import type { Blueprint, BlueprintVariant, BlueprintPlaceholder } from '../types/template';
import type { PodProvider } from '../types/pod';
import {
  SupplierBlueprint,
  PrintifyBlueprint,
  PrintfulBlueprint,
  GootenBlueprint,
  GelatoBlueprint,
  SUPPLIER_ENDPOINTS
} from '../types/supplier';

interface BlueprintSearchParams {
  query?: string;
  provider?: PodProvider;
  category?: string;
  page?: number;
  limit?: number;
}

interface BlueprintSearchResults {
  blueprints: Blueprint[];
  total: number;
  page: number;
  hasMore: boolean;
}

// Normalize supplier blueprints to our internal format
function normalizeBlueprint(supplier: SupplierBlueprint): Blueprint {
  const { provider, data } = supplier;
  
  switch (provider) {
    case 'printify': {
      const blueprint = data as PrintifyBlueprint;
      return {
        id: blueprint.id,
        title: blueprint.title,
        description: blueprint.description,
        providerId: blueprint.id,
        provider,
        variants: blueprint.variants.map(v => ({
          id: v.id,
          title: v.title,
          sku: v.sku,
          options: v.options,
          pricing: {
            baseCost: v.cost,
            retailPrice: v.price
          }
        })),
        placeholders: blueprint.print_areas?.map(area => ({
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
          baseCost: blueprint.variants[0]?.cost || 0,
          retailPrice: blueprint.variants[0]?.price || 0
        }
      };
    }

    case 'printful': {
      const blueprint = data as PrintfulBlueprint;
      return {
        id: blueprint.id,
        title: blueprint.name,
        description: blueprint.description,
        providerId: blueprint.id,
        provider,
        variants: blueprint.variants.map(v => ({
          id: v.id,
          title: v.name,
          sku: v.sku,
          options: v.options,
          pricing: {
            baseCost: v.cost,
            retailPrice: v.retail_price
          }
        })),
        placeholders: blueprint.print_details?.placement_areas?.map(area => ({
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
          baseCost: blueprint.variants[0]?.cost || 0,
          retailPrice: blueprint.variants[0]?.retail_price || 0
        }
      };
    }

    case 'gooten': {
      const blueprint = data as GootenBlueprint;
      return {
        id: blueprint.id,
        title: blueprint.name,
        description: blueprint.description,
        providerId: blueprint.id,
        provider,
        variants: blueprint.variants.map(v => ({
          id: v.id,
          title: v.name,
          sku: v.sku,
          options: v.options,
          pricing: {
            baseCost: v.price * 0.7, // Estimated cost
            retailPrice: v.price
          }
        })),
        placeholders: blueprint.printAreas.map(area => ({
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
          baseCost: blueprint.variants[0]?.price * 0.7 || 0,
          retailPrice: blueprint.variants[0]?.price || 0
        }
      };
    }

    case 'gelato': {
      const blueprint = data as GelatoBlueprint;
      return {
        id: blueprint.id,
        title: blueprint.name,
        description: blueprint.description,
        providerId: blueprint.id,
        provider,
        variants: blueprint.variants.map(v => ({
          id: v.id,
          title: v.name,
          sku: v.sku,
          options: v.attributes,
          pricing: {
            baseCost: v.basePrice,
            retailPrice: v.basePrice * 2 // Default markup
          }
        })),
        placeholders: blueprint.printAreas.map(area => ({
          id: area.id,
          name: area.name,
          width: area.width,
          height: area.height,
          x: area.position.x,
          y: area.position.y,
          rotation: area.position.rotation,
          required: true,
          constraints: {
            minDpi: 300,
            maxDpi: 300,
            allowedFormats: ['PNG']
          }
        })),
        pricing: {
          baseCost: blueprint.variants[0]?.basePrice || 0,
          retailPrice: (blueprint.variants[0]?.basePrice || 0) * 2
        }
      };
    }
  }
}

export class BlueprintService {
  private async fetchWithAuth(url: string, provider: PodProvider): Promise<unknown> {
    const { data: credentials } = await supabase
      .from('provider_credentials')
      .select('api_key')
      .eq('provider', provider)
      .single();

    if (!credentials?.api_key) {
      throw new Error(`No API key found for provider: ${provider}`);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    switch (provider) {
      case 'printify':
        headers.Authorization = `Bearer ${credentials.api_key}`;
        break;
      case 'printful':
        headers.Authorization = `Bearer ${credentials.api_key}`;
        break;
      case 'gooten':
        headers['X-API-Key'] = credentials.api_key;
        break;
      case 'gelato':
        headers['X-API-KEY'] = credentials.api_key;
        break;
    }

    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    return response.json();
  }

  async searchBlueprints(params: BlueprintSearchParams): Promise<BlueprintSearchResults> {
    const blueprints: Blueprint[] = [];

    if (!params.provider || params.provider === 'printify') {
      const data = await this.fetchWithAuth(
        SUPPLIER_ENDPOINTS.printify.blueprints,
        'printify'
      ) as { data: PrintifyBlueprint[] };
      
      blueprints.push(...data.data.map(bp => normalizeBlueprint({
        provider: 'printify',
        data: bp
      })));
    }

    if (!params.provider || params.provider === 'printful') {
      const data = await this.fetchWithAuth(
        SUPPLIER_ENDPOINTS.printful.blueprints,
        'printful'
      ) as { result: PrintfulBlueprint[] };
      
      blueprints.push(...data.result.map(bp => normalizeBlueprint({
        provider: 'printful',
        data: bp
      })));
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

    if (params.category) {
      filtered = filtered.filter(bp => 
        bp.title.toLowerCase().includes(params.category!.toLowerCase())
      );
    }

    // Handle pagination
    const page = params.page || 1;
    const limit = params.limit || 20;
    const start = (page - 1) * limit;
    const end = start + limit;
    const results = filtered.slice(start, end);

    return {
      blueprints: results,
      total: filtered.length,
      page,
      hasMore: end < filtered.length
    };
  }

  async getBlueprint(id: string, provider: PodProvider): Promise<Blueprint> {
    const endpoint = SUPPLIER_ENDPOINTS[provider].blueprint(id);
    const response = await this.fetchWithAuth(endpoint, provider);

    return normalizeBlueprint({
      provider,
      data: provider === 'printful' ? response.result : response
    });
  }

  async updateBlueprintPlaceholders(
    blueprintId: string,
    placeholders: BlueprintPlaceholder[]
  ): Promise<void> {
    const { error } = await supabase
      .from('blueprint_placeholders')
      .upsert(
        placeholders.map(p => ({
          blueprint_id: blueprintId,
          placeholder_id: p.id,
          x: p.x,
          y: p.y,
          rotation: p.rotation,
          scale: 1, // Default scale factor
        }))
      );

    if (error) throw error;
  }

  async updateBlueprintVariants(
    blueprintId: string,
    variants: BlueprintVariant[]
  ): Promise<void> {
    const { error } = await supabase
      .from('blueprint_variants')
      .upsert(
        variants.map(v => ({
          blueprint_id: blueprintId,
          variant_id: v.id,
          options: v.options,
          pricing: v.pricing
        }))
      );

    if (error) throw error;
  }
}

export const blueprintService = new BlueprintService();