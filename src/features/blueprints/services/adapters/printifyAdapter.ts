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
import {
  getProviderConfig,
  getProviderEndpoint,
  getProviderHeaders
} from '../../config/providers';
import { logger } from '../../utils/logger';

interface PrintifyProduct {
  id: string;
  title: string;
  description: string;
  blueprint_id: string;
  created_at: string;
  updated_at: string;
  variants: PrintifyVariant[];
  print_areas: PrintifyPrintArea[];
  print_provider_id: string;
  images: PrintifyImage[];
  tags: string[];
}

interface PrintifyVariant {
  id: number;
  sku: string;
  title: string;
  options: Record<string, string>;
  placeholders: Record<string, string>;
  price: number;
  is_enabled: boolean;
  grams: number;
  is_default: boolean;
}

interface PrintifyPrintArea {
  id: string;
  title: string;
  constraints: {
    dpi: { min: number; max: number };
    width: { min: number; max: number };
    height: { min: number; max: number };
  };
  position: string;
}

interface PrintifyImage {
  id: string;
  src: string;
  position: string;
  type: string;
  variant_ids: number[];
}

export class PrintifyAdapter implements PrintProvider {
  private providerId = 'printify' as const;
  private config;
  private apiKey: string;
  private rateLimits: ProviderRateLimits;

  constructor({ apiKey }: ProviderConfig) {
    this.apiKey = apiKey;
    this.config = getProviderConfig(this.providerId);
    this.rateLimits = {
      requestLimit: this.config.rateLimit.requestsPerMinute,
      windowSize: 60,
      remaining: this.config.rateLimit.requestsPerMinute,
      resetAt: Date.now() + 60000
    };
    logger.info(`Initialized Printify adapter`, { provider: this.providerId });
  }

  public get id(): string {
    return this.providerId;
  }

  public get name(): string {
    return this.config.name;
  }

  public get apiEndpoint(): string {
    return this.config.endpoints.base;
  }

  public get apiVersion(): string {
    return this.config.apiVersion;
  }

  async fetchBlueprints(params: BlueprintSearchParams): Promise<BlueprintSearchResult> {
    const startTime = Date.now();
    try {
      let endpoint = getProviderEndpoint(this.providerId, 'blueprints');

      // Add pagination parameters
      const queryParams = new URLSearchParams();
      if (params.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      if (params.page) {
        queryParams.append('page', params.page.toString());
      }
      if (queryParams.toString()) {
        endpoint += `?${queryParams.toString()}`;
      }

      logger.apiCall(this.providerId, endpoint, { params });

      const response = await fetch(endpoint, {
        headers: getProviderHeaders(this.providerId, this.apiKey),
      });

      const duration = Date.now() - startTime;
      this.updateRateLimits(response.headers);
      
      logger.apiResponse(this.providerId, endpoint, response.status, duration, {
        rateLimit: this.rateLimits
      });

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data = await response.json();
      const blueprints = data.data.map(this.normalizeBlueprint.bind(this));

      return {
        items: blueprints,
        total: data.total,
        page: params.page || 1,
        limit: params.limit || 20,
        hasMore: (params.page || 1) * (params.limit || 20) < data.total
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error('Failed to fetch blueprints', error as Error, {
        provider: this.providerId,
        duration,
        params
      });

      if (error instanceof BlueprintError) {
        throw error;
      }
      throw new NetworkError(
        `Failed to fetch blueprints from ${this.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.id
      );
    }
  }

  async fetchBlueprintDetails(blueprintId: string): Promise<Blueprint> {
    const startTime = Date.now();
    try {
      const endpoint = `${getProviderEndpoint(this.providerId, 'blueprints')}/${blueprintId}`;
      
      logger.apiCall(this.providerId, endpoint, { blueprintId });

      const response = await fetch(endpoint, {
        headers: getProviderHeaders(this.providerId, this.apiKey),
      });

      const duration = Date.now() - startTime;
      this.updateRateLimits(response.headers);

      logger.apiResponse(this.providerId, endpoint, response.status, duration, {
        rateLimit: this.rateLimits,
        blueprintId
      });

      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const data = await response.json();
      return this.normalizeBlueprint(data);
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error('Failed to fetch blueprint details', error as Error, {
        provider: this.providerId,
        duration,
        blueprintId
      });

      if (error instanceof BlueprintError) {
        throw error;
      }
      throw new NetworkError(
        `Failed to fetch blueprint details from ${this.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.id
      );
    }
  }

  async checkAvailability(): Promise<boolean> {
    const startTime = Date.now();
    try {
      const response = await fetch(`${this.config.endpoints.base}/shops`, {
        headers: getProviderHeaders(this.providerId, this.apiKey),
      });

      const duration = Date.now() - startTime;
      logger.apiResponse(this.providerId, '/shops', response.status, duration);

      return response.ok;
    } catch (error) {
      logger.error('Provider availability check failed', error as Error, {
        provider: this.providerId
      });
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

    logger.debug('Blueprint validation', {
      provider: this.providerId,
      blueprint,
      errors
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private normalizeBlueprint(data: PrintifyProduct): Blueprint {
    const normalized = {
      id: data.id,
      providerId: this.id,
      sku: data.blueprint_id,
      name: data.title,
      description: data.description,
      category: 'apparel',
      variants: this.normalizeVariants(data.variants),
      printingOptions: this.normalizePrintAreas(data.print_areas),
      images: data.images.map(img => ({
        id: img.id,
        url: img.src,
        position: Number(img.position),
        type: img.type as 'preview' | 'mockup' | 'template'
      })),
      productionTime: this.getProductionTimeEstimate(),
      pricing: {
        base: {
          amount: Math.min(...data.variants.map(v => v.price)),
          currency: 'USD'
        }
      },
      metadata: {
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        isActive: true,
        tags: data.tags
      }
    };

    logger.debug('Normalized blueprint', {
      provider: this.providerId,
      originalId: data.id,
      normalizedData: normalized
    });

    return normalized;
  }

  private normalizeVariants(variants: PrintifyVariant[]): ProductVariant[] {
    return variants.map(variant => ({
      id: variant.id.toString(),
      sku: variant.sku,
      name: variant.title,
      attributes: variant.options,
      stock: variant.is_enabled ? 999 : 0,
      price: {
        amount: variant.price,
        currency: 'USD'
      }
    }));
  }

  private normalizePrintAreas(areas: PrintifyPrintArea[]): PrintingOption[] {
    return areas.map(area => ({
      id: area.id,
      technique: 'dtg',
      locations: [area.position],
      constraints: {
        minDpi: area.constraints.dpi.min,
        maxDpi: area.constraints.dpi.max,
        width: area.constraints.width.max,
        height: area.constraints.height.max,
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

      logger.debug('Rate limits updated', {
        provider: this.providerId,
        rateLimits: this.rateLimits
      });
    }
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    const data = await response.json();
    
    let error: BlueprintError;
    switch (response.status) {
      case 401:
        error = new AuthenticationError(this.id, data.message);
        break;
      case 404:
        error = new BlueprintNotFoundError(data.blueprint_id || 'unknown', this.id);
        break;
      case 429:
        error = new RateLimitError(
          this.id,
          response.url,
          this.rateLimits.resetAt
        );
        break;
      default:
        error = new ProviderAPIError(
          data.message || 'Unknown error occurred',
          this.id,
          response.status,
          response.url,
          response.status >= 500
        );
    }

    logger.error('API error response', error, {
      provider: this.providerId,
      status: response.status,
      url: response.url,
      response: data
    });

    throw error;
  }
}