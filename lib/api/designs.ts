import axios from 'axios';
import type { Design } from '@/types/models';

const API_BASE = '/api/designs';

export const DesignsAPI = {
  async list(filters?: { 
    search?: string;
    tags?: string[];
    colors?: string[];
    page?: number;
    limit?: number;
  }) {
    const response = await axios.get(API_BASE, { params: filters });
    return response.data as { data: Design[]; total: number };
  },

  async create(data: Partial<Design>) {
    const response = await axios.post(API_BASE, data);
    return response.data as Design;
  },

  async update(id: string, data: Partial<Design>) {
    const response = await axios.patch(`${API_BASE}/${id}`, data);
    return response.data as Design;
  },

  async delete(id: string) {
    await axios.delete(`${API_BASE}/${id}`);
  },

  async extractColors(imageUrl: string) {
    const response = await axios.post(`${API_BASE}/extract-colors`, { imageUrl });
    return response.data as string[];
  },

  async bulkUpdate(ids: string[], data: Partial<Design>) {
    const response = await axios.patch(`${API_BASE}/bulk`, {
      ids,
      ...data
    });
    return response.data as Design[];
  }
};
