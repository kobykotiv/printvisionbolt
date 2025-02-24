import { 
  PrintProvider,
  ProviderConfig,
  ProviderRateLimits,
  ValidationResult
} from '../../types/provider';
import {
  Blueprint,
  BlueprintSearchParams,
  BlueprintSearchResult,
  ProductVariant,
  PrintingOption,
  ProductionTimeEstimate
} from '../../types/blueprint';
import {
  BlueprintError,
  ProviderAPIError,
  RateLimitError,
  BlueprintNotFoundError,
  AuthenticationError,
  NetworkError
} from '../../types/errors';

interface PrintfulProduct {
  id: number;
  type: string;
  title: string;
  brand: string;
  model: string;
  image: string;
  variant_count: number;
  currency: string;
  files: PrintfulFile[];
  variants: PrintfulVariant[];
  techniques: PrintfulTechnique[];
}

interface PrintfulFile {
  id: number;
  type: string;
  url: string;
  options: string[];
  filename: string;
  mime_type: string;
  size: number;
  width: number;
  height: number;
  dpi: number;
  status: string;
}

interface PrintfulVariant {
  id: number;
  product_id: number;
  name: string;
  size: string;
  color: string;
  color_code: string;
  image: string;
  price: number;
  in_stock: boolean;
  availability_status: string;
}

interface PrintfulTechnique {
  name: string;
  areas: {
    name: string;
    width: number;
    height: number;
    dpi: { min: number; max: number };
  }[];
}

export class PrintfulAdapter implements PrintProvider {
  private baseUrl: string;
  private apiKey: string;
  private rateLimits: ProviderRateLimits;

  constructor(config: ProviderConfig) {
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    this.rateLimits = {
      requestLimit: 120,
      windowSize: 60,
      remaining: 120,
      resetAt: Date.now() + 60000
    };
  }

  public get id(): string {
    return 'printful';
  }

  public get name(): string {
    return 'Printful';
  }

  public get apiEndpoint(): string {
    return this.baseUrl;
  }

  public get apiVersion(): string {
    return 'v1';
  }

  async fetchBlueprints(params: BlueprintSearchParams): Promise<BlueprintSearchResult> {
    try {
      const response = await fetch(`${this.baseUrl}/products`, {
        headers: this.getHeaders(),
      });

      this.updateRateLimits(response.headers);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data = await response.json();
      const blueprints = data.result.map(this.normalizeBlueprint.bind(this));

      return {
        items: blueprints,
        total: data.total,
        page: params.page || 1,
        limit: params.limit || 20,
        hasMore: (params.page || 1) * (params.limit || 20) < data.total
      };
    } catch (error) {
      if (error instanceof BlueprintError) {
        throw error;
      }
      throw new NetworkError(
        `Failed to fetch blueprints from Printful: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.id
      );
    }
  }

  async fetchBlueprintDetails(blueprintId: string): Promise<Blueprint> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${blueprintId}`, {
        headers: this.getHeaders(),
      });

      this.updateRateLimits(response.headers);

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data = await response.json();
      return this.normalizeBlueprint(data.result);
    } catch (error) {
      if (error instanceof BlueprintError) {
        throw error;
      }
      throw new NetworkError(
        `Failed to fetch blueprint details from Printful: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.id
      );
    }
  }

  async checkAvailability(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/store`, {
        headers: this.getHeaders(),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  getRateLimits(): ProviderRateLimits {
    return this.rateLimits;
  }

  async validateBlueprint(blueprint: Partial<Blueprint>): Promise<ValidationResult> {
    const errors: Array<{ field: string; message: string }> = [];
    
    if (!blueprint.name) {
      errors.push({ field: 'name', message: 'Name is required' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private normalizeBlueprint(data: PrintfulProduct): Blueprint {
    return {
      id: data.id.toString(),
      providerId: this.id,
      sku: data.model,
      name: data.title,
      description: `${data.brand} - ${data.model}`,
      category: data.type,
      variants: this.normalizeVariants(data.variants),
      printingOptions: this.normalizePrintingOptions(data.techniques),
      images: [{
        id: 'main',
        url: data.image,
        position: 0,
        type: 'preview'
      }],
      productionTime: this.getProductionTimeEstimate(),
      pricing: {
        base: {
          amount: Math.min(...data.variants.map(v => v.price)),
          currency: data.currency
        }
      },
      metadata: {
        createdAt: new Date().toISOString(), // Printful doesn't provide creation date
        updatedAt: new Date().toISOString(),
        isActive: true,
        tags: [data.type, data.brand]
      }
    };
  }

  private normalizeVariants(variants: PrintfulVariant[]): ProductVariant[] {
    return variants.map(variant => ({
      id: variant.id.toString(),
      sku: `${variant.product_id}-${variant.id}`,
      name: variant.name,
      attributes: {
        size: variant.size,
        color: variant.color
      },
      stock: variant.in_stock ? 999 : 0,
      price: {
        amount: variant.price,
        currency: 'USD'
      }
    }));
  }

  private normalizePrintingOptions(techniques: PrintfulTechnique[]): PrintingOption[] {
    return techniques.map(technique => ({
      id: technique.name.toLowerCase().replace(/\s+/g, '-'),
      technique: technique.name,
      locations: technique.areas.map(area => area.name),
      constraints: {
        minDpi: Math.min(...technique.areas.map(area => area.dpi.min)),
        maxDpi: Math.max(...technique.areas.map(area => area.dpi.max)),
        width: Math.max(...technique.areas.map(area => area.width)),
        height: Math.max(...technique.areas.map(area => area.height)),
        fileTypes: ['png', 'jpg']
      }
    }));
  }

  private getProductionTimeEstimate(): ProductionTimeEstimate {
    return {
      min: 3,
      max: 5,
      unit: 'days'
    };
  }

  private getHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  private updateRateLimits(headers: Headers): void {
    const remaining = headers.get('X-RateLimit-Remaining');
    const reset = headers.get('X-RateLimit-Reset');
    const limit = headers.get('X-RateLimit-Limit');

    if (remaining && reset && limit) {
      this.rateLimits = {
        requestLimit: parseInt(limit, 10),
        windowSize: 60,
        remaining: parseInt(remaining, 10),
        resetAt: parseInt(reset, 10) * 1000
      };
    }
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    const data = await response.json();
    
    switch (response.status) {
      case 401:
        throw new AuthenticationError(this.id, data.message);
      case 404:
        throw new BlueprintNotFoundError(data.product_id || 'unknown', this.id);
      case 429:
        throw new RateLimitError(
          this.id,
          response.url,
          this.rateLimits.resetAt
        );
      default:
        throw new ProviderAPIError(
          data.message || 'Unknown error occurred',
          this.id,
          response.status,
          response.url,
          response.status >= 500
        );
    }
  }
}