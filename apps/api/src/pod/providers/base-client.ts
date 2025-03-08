import { RateLimit } from '../types';

export abstract class PodBaseClient {
  protected apiKey: string;
  protected baseUrl: string;
  protected rateLimit: RateLimit = {
    limit: 0,
    remaining: 0,
    reset: 0
  };

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  protected async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      // Update rate limiting info
      this.updateRateLimit(response);

      // Check if we need to handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        throw new Error(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
      }

      // Handle other error responses
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(
          `API request failed: ${response.status} - ${JSON.stringify(error)}`
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`API request failed: ${error.message}`);
      }
      throw error;
    }
  }

  protected updateRateLimit(response: Response): void {
    const limit = response.headers.get('X-RateLimit-Limit');
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');

    if (limit && remaining && reset) {
      this.rateLimit = {
        limit: parseInt(limit, 10),
        remaining: parseInt(remaining, 10),
        reset: parseInt(reset, 10)
      };
    }
  }

  protected async get<T>(endpoint: string, query?: Record<string, string>): Promise<T> {
    const queryString = query ? `?${new URLSearchParams(query)}` : '';
    return this.fetch<T>(`${endpoint}${queryString}`, { method: 'GET' });
  }

  protected async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  protected async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  protected async delete<T>(endpoint: string): Promise<T> {
    return this.fetch<T>(endpoint, { method: 'DELETE' });
  }

  protected async patch<T>(endpoint: string, data: unknown): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  public getRateLimit(): RateLimit {
    return { ...this.rateLimit };
  }

  public abstract getProducts(): Promise<any>;
  public abstract getProduct(id: string): Promise<any>;
  public abstract createOrder(order: unknown): Promise<any>;
  public abstract getOrder(id: string): Promise<any>;
  public abstract calculateShipping(address: unknown): Promise<any>;
}