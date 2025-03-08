/**
 * Common types shared across the application
 */

export interface ShippingAddress {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

export interface Money {
  amount: number;
  currency: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface Contact {
  name: string;
  email: string;
  phone?: string;
}

// Common status types
export type PublishStatus = 'draft' | 'published' | 'archived';
export type ActiveStatus = 'active' | 'inactive';
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Common response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    pagination?: Pagination;
    [key: string]: unknown;
  };
}

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}