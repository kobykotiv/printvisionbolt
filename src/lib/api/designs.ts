import { APIClient } from './client';
import { Database } from '../database.types';

// Type for Design from database schema
type DBDesign = Database['public']['Tables']['designs']['Row'];

// Extended type for API responses
export interface Design extends DBDesign {
  preview_url?: string;
  stats?: {
    views: number;
    downloads: number;
    shares: number;
  };
}

export interface DesignFilters {
  search?: string;
  tags?: string[];
  colors?: string[];
  page?: number;
  limit?: number;
}

export interface DesignListResponse {
  data: Design[];
  total: number;
  page: number;
  limit: number;
}

class DesignsAPIClient extends APIClient {
  constructor() {
    super('/api/designs');
  }

  async list(filters?: DesignFilters): Promise<DesignListResponse> {
    return this.get<DesignListResponse>('/', { params: filters });
  }

  async getById(id: string): Promise<Design> {
    return this.get<Design>(`/${id}`);
  }

  async create(data: Omit<Design, 'id' | 'created_at' | 'updated_at'>): Promise<Design> {
    return this.post<Design, Partial<Design>>('/', data);
  }

  async update(id: string, data: Partial<Design>): Promise<Design> {
    return this.patch<Design, Partial<Design>>(`/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return this.delete(`/${id}`);
  }

  async extractColors(imageUrl: string): Promise<string[]> {
    return this.post<string[]>('/extract-colors', { imageUrl });
  }

  async bulkUpdate(ids: string[], data: Partial<Design>): Promise<Design[]> {
    return this.patch<Design[], { ids: string[] } & Partial<Design>>('/bulk', {
      ids,
      ...data,
    });
  }
}

export const designsAPI = new DesignsAPIClient();

// React Query keys
export const designKeys = {
  all: ['designs'] as const,
  lists: () => [...designKeys.all, 'list'] as const,
  list: (filters: DesignFilters) => [...designKeys.lists(), filters] as const,
  details: () => [...designKeys.all, 'detail'] as const,
  detail: (id: string) => [...designKeys.details(), id] as const,
};