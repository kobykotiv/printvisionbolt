import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

// Define standard API error structure
export interface APIError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

// Create custom error class
export class APIRequestError extends Error {
  constructor(
    public readonly error: APIError,
    public readonly status: number
  ) {
    super(error.message);
    this.name = 'APIRequestError';
  }
}

// Define base client class
export class APIClient {
  private client: AxiosInstance;

  constructor(baseURL: string = '/api') {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response: { data: unknown }) => response,
      (error: AxiosError<APIError>) => {
        if (error.response) {
          throw new APIRequestError(
            error.response.data || {
              message: 'An unexpected error occurred',
              code: 'UNKNOWN_ERROR',
            },
            error.response.status
          );
        }
        throw new APIRequestError(
          {
            message: 'Network error occurred',
            code: 'NETWORK_ERROR',
          },
          0
        );
      }
    );
  }

  // Generic request method with type safety
  protected async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.client.request<T>(config);
    return response.data;
  }

  // Helper methods for common HTTP methods
  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  protected async post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  protected async patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  protected async delete(url: string, config?: AxiosRequestConfig): Promise<void> {
    await this.request<void>({ ...config, method: 'DELETE', url });
  }
}