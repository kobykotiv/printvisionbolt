/**
 * Provider configuration for all supported print-on-demand services
 */

export interface ProviderEndpoints {
  base: string;
  blueprints: string;
  products: string;
  variants: string;
  catalog: string;
}

export interface ProviderDefinition {
  name: string;
  description: string;
  apiVersion: string;
  documentationUrl: string;
  endpoints: ProviderEndpoints;
  defaultHeaders: Record<string, string>;
  rateLimit: {
    requestsPerMinute: number;
    burstLimit?: number;
  };
  features: {
    webhooks: boolean;
    bulkOperations: boolean;
    variantGrouping: boolean;
    customPricing: boolean;
    stockTracking: boolean;
  };
}

export const PROVIDER_CONFIGS: Record<string, ProviderDefinition> = {
  printify: {
    name: 'Printify',
    description: 'Global print-on-demand platform with multiple print providers',
    apiVersion: 'v1',
    documentationUrl: 'https://developers.printify.com',
    endpoints: {
      base: 'https://api.printify.com/v1',
      blueprints: '/catalog/blueprints',
      products: '/products',
      variants: '/variants',
      catalog: '/catalog'
    },
    defaultHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    rateLimit: {
      requestsPerMinute: 100,
      burstLimit: 120
    },
    features: {
      webhooks: true,
      bulkOperations: true,
      variantGrouping: true,
      customPricing: true,
      stockTracking: false
    }
  },
  printful: {
    name: 'Printful',
    description: 'Print-on-demand drop shipping and warehousing service',
    apiVersion: 'v1',
    documentationUrl: 'https://developers.printful.com',
    endpoints: {
      base: 'https://api.printful.com',
      blueprints: '/store/products',
      products: '/products',
      variants: '/variants',
      catalog: '/store/products'
    },
    defaultHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    rateLimit: {
      requestsPerMinute: 120
    },
    features: {
      webhooks: true,
      bulkOperations: false,
      variantGrouping: true,
      customPricing: true,
      stockTracking: true
    }
  },
  gooten: {
    name: 'Gooten',
    description: 'Global print-on-demand manufacturing network',
    apiVersion: 'v1',
    documentationUrl: 'https://www.gooten.com/docs/api',
    endpoints: {
      base: 'https://api.gooten.com/v1',
      blueprints: '/products',
      products: '/products',
      variants: '/variants',
      catalog: '/products/all'
    },
    defaultHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    rateLimit: {
      requestsPerMinute: 60
    },
    features: {
      webhooks: false,
      bulkOperations: false,
      variantGrouping: true,
      customPricing: false,
      stockTracking: true
    }
  },
  gelato: {
    name: 'Gelato',
    description: 'Global print-on-demand production network',
    apiVersion: 'v3',
    documentationUrl: 'https://docs.gelato.com',
    endpoints: {
      base: 'https://product.gelatoapis.com/v3',
      blueprints: '/catalogs',
      products: '/products',
      variants: '/variants',
      catalog: '/catalogs/products'
    },
    defaultHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    rateLimit: {
      requestsPerMinute: 150,
      burstLimit: 200
    },
    features: {
      webhooks: true,
      bulkOperations: true,
      variantGrouping: true,
      customPricing: true,
      stockTracking: true
    }
  }
};

/**
 * Get provider configuration by ID
 */
export function getProviderConfig(providerId: keyof typeof PROVIDER_CONFIGS): ProviderDefinition {
  const config = PROVIDER_CONFIGS[providerId];
  if (!config) {
    throw new Error(`Provider configuration not found for: ${providerId}`);
  }
  return config;
}

/**
 * Get API endpoint for a specific provider and endpoint type
 */
export function getProviderEndpoint(
  providerId: keyof typeof PROVIDER_CONFIGS,
  endpointType: keyof ProviderEndpoints
): string {
  const config = getProviderConfig(providerId);
  return `${config.endpoints.base}${config.endpoints[endpointType]}`;
}

/**
 * Get complete headers for a provider including authentication
 */
export function getProviderHeaders(
  providerId: keyof typeof PROVIDER_CONFIGS,
  apiKey: string
): Record<string, string> {
  const config = getProviderConfig(providerId);
  return {
    ...config.defaultHeaders,
    'Authorization': `Bearer ${apiKey}`
  };
}

/**
 * Check if a provider supports a specific feature
 */
export function providerSupportsFeature(
  providerId: keyof typeof PROVIDER_CONFIGS,
  feature: keyof ProviderDefinition['features']
): boolean {
  const config = getProviderConfig(providerId);
  return config.features[feature];
}