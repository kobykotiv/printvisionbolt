import { Blueprint, BlueprintSearchParams, BlueprintSearchResult } from './blueprint';

export interface ProviderConfig {
  apiKey: string;
  baseUrl: string;
  timeout?: number;
  retry?: {
    maxRetries: number;
    retryDelay: number;
    retryableStatuses: number[];
  };
  cache?: {
    ttl: number;
    staleWhileRevalidate: number;
  };
}

export interface ProviderRateLimits {
  requestLimit: number;
  windowSize: number; // in seconds
  remaining: number;
  resetAt: number; // timestamp
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface PrintProvider {
  id: string;
  name: string;
  apiEndpoint: string;
  apiVersion: string;

  // Provider operations
  fetchBlueprints: (params: BlueprintSearchParams) => Promise<BlueprintSearchResult>;
  fetchBlueprintDetails: (id: string) => Promise<Blueprint>;
  checkAvailability: () => Promise<boolean>;
  getRateLimits: () => ProviderRateLimits;
  validateBlueprint: (blueprint: Partial<Blueprint>) => Promise<ValidationResult>;
}