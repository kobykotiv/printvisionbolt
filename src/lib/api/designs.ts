import { Database } from '../database.types';
import { APIClient } from './client';

type Design = Database['public']['Tables']['designs']['Row'];
type CreateDesign = Database['public']['Tables']['designs']['Insert'];
type UpdateDesign = Database['public']['Tables']['designs']['Update'];

interface DesignQueryParams {
  shop_id?: string;
  user_id?: string;
  tags?: string[];
  page?: number;
  limit?: number;
  sort_by?: keyof Design;
  sort_order?: 'asc' | 'desc';
}

interface DesignResponse {
  data: Design[];
  total: number;
  page: number;
  limit: number;
}

export class DesignsAPI extends APIClient {
  constructor() {
    super('/api/designs');
  }

  /**
   * Fetch designs with optional filtering and pagination
   */
  async getDesigns(params: DesignQueryParams = {}): Promise<DesignResponse> {
    return this.get<DesignResponse>('/', { params });
  }

  /**
   * Fetch a single design by ID
   */
  async getDesign(id: string): Promise<Design> {
    return this.get<Design>(`/${id}`);
  }

  /**
   * Create a new design
   */
  async createDesign(design: CreateDesign): Promise<Design> {
    return this.post<Design, CreateDesign>('/', design);
  }

  /**
   * Update an existing design
   */
  async updateDesign(id: string, updates: UpdateDesign): Promise<Design> {
    return this.patch<Design, UpdateDesign>(`/${id}`, updates);
  }

  /**
   * Delete a design
   */
  async deleteDesign(id: string): Promise<void> {
    return this.delete(`/${id}`);
  }

  /**
   * Upload design file and get file URL
   */
  async uploadDesignFile(file: File): Promise<{ file_url: string; thumbnail_url?: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.post<{ file_url: string; thumbnail_url?: string }, FormData>(
      '/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  }

  /**
   * Bulk create/update designs
   */
  async bulkCreateDesigns(designs: CreateDesign[]): Promise<{ 
    successful: Design[];
    failed: Array<{ design: CreateDesign; error: string }>;
  }> {
    return this.post<
      { successful: Design[]; failed: Array<{ design: CreateDesign; error: string }> },
      { designs: CreateDesign[] }
    >('/bulk', { designs });
  }

  /**
   * Get designs by tag
   */
  async getDesignsByTag(tag: string, params: Omit<DesignQueryParams, 'tags'> = {}): Promise<DesignResponse> {
    return this.get<DesignResponse>('/tags/${tag}', { params });
  }

  /**
   * Add tags to a design
   */
  async addTags(id: string, tags: string[]): Promise<Design> {
    return this.post<Design, { tags: string[] }>(`/${id}/tags`, { tags });
  }

  /**
   * Remove tags from a design
   */
  async removeTags(id: string, tags: string[]): Promise<Design> {
    return this.patch<Design, { tags: string[] }>(`/${id}/tags/remove`, { tags });
  }
}

// Create singleton instance
export const designsAPI = new DesignsAPI();

// Export type for use in hooks/components
export type { Design, CreateDesign, UpdateDesign, DesignQueryParams, DesignResponse };