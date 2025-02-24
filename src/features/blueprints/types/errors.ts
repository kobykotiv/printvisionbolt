/**
 * Common error details interface
 */
export interface ErrorMetadata {
  timestamp?: number;
  requestId?: string;
  correlationId?: string;
  [key: string]: unknown;
}

/**
 * Base error class for all blueprint-related errors
 */
export class BlueprintError extends Error {
  public metadata: ErrorMetadata;

  constructor(
    message: string,
    public code: string,
    details?: ErrorMetadata
  ) {
    super(message);
    this.name = 'BlueprintError';
    this.metadata = {
      timestamp: Date.now(),
      ...details
    };
  }
}

/**
 * Error thrown when there's an issue with a provider's API
 */
export class ProviderAPIError extends BlueprintError {
  constructor(
    message: string,
    public providerId: string,
    public statusCode: number,
    public endpoint: string,
    public retryable: boolean = false,
    details?: ErrorMetadata
  ) {
    super(message, 'PROVIDER_API_ERROR', {
      timestamp: Date.now(),
      providerId,
      statusCode,
      endpoint,
      retryable,
      ...details
    });
    this.name = 'ProviderAPIError';
  }
}

/**
 * Error thrown when rate limits are exceeded
 */
export class RateLimitError extends ProviderAPIError {
  constructor(
    providerId: string,
    endpoint: string,
    public resetAt: number,
    details?: ErrorMetadata
  ) {
    super(
      `Rate limit exceeded for provider ${providerId}. Resets at ${new Date(resetAt).toISOString()}`,
      providerId,
      429,
      endpoint,
      true,
      {
        timestamp: Date.now(),
        resetAt,
        ...details
      }
    );
    this.name = 'RateLimitError';
  }
}

/**
 * Validation error details
 */
export interface ValidationErrorDetail {
  field: string;
  message: string;
  code?: string;
}

/**
 * Error thrown when there are validation issues
 */
export class ValidationError extends BlueprintError {
  constructor(
    message: string,
    public errors: ValidationErrorDetail[],
    details?: ErrorMetadata
  ) {
    super(message, 'VALIDATION_ERROR', {
      timestamp: Date.now(),
      errors,
      ...details
    });
    this.name = 'ValidationError';
  }
}

/**
 * Error thrown when a blueprint is not found
 */
export class BlueprintNotFoundError extends BlueprintError {
  constructor(
    public blueprintId: string,
    public providerId: string,
    details?: ErrorMetadata
  ) {
    super(
      `Blueprint ${blueprintId} not found for provider ${providerId}`,
      'BLUEPRINT_NOT_FOUND',
      {
        timestamp: Date.now(),
        blueprintId,
        providerId,
        ...details
      }
    );
    this.name = 'BlueprintNotFoundError';
  }
}

/**
 * Error thrown when there are authentication issues
 */
export class AuthenticationError extends BlueprintError {
  constructor(
    public providerId: string,
    message: string = 'Authentication failed',
    details?: ErrorMetadata
  ) {
    super(message, 'AUTHENTICATION_ERROR', {
      timestamp: Date.now(),
      providerId,
      ...details
    });
    this.name = 'AuthenticationError';
  }
}

/**
 * Error thrown when a provider is not available
 */
export class ProviderUnavailableError extends BlueprintError {
  constructor(
    public providerId: string,
    message: string = 'Provider service is currently unavailable',
    details?: ErrorMetadata
  ) {
    super(message, 'PROVIDER_UNAVAILABLE', {
      timestamp: Date.now(),
      providerId,
      ...details
    });
    this.name = 'ProviderUnavailableError';
  }
}

/**
 * Error thrown when there are network issues
 */
export class NetworkError extends BlueprintError {
  constructor(
    message: string,
    public providerId: string,
    public retryable: boolean = true,
    details?: ErrorMetadata
  ) {
    super(message, 'NETWORK_ERROR', {
      timestamp: Date.now(),
      providerId,
      retryable,
      ...details
    });
    this.name = 'NetworkError';
  }
}

/**
 * Error response from providers
 */
export interface ProviderErrorResponse {
  error: {
    code: string;
    message: string;
    details?: ErrorMetadata;
  };
  statusCode: number;
  timestamp: number;
}