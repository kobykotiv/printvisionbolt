import axios from 'axios';
import type { Shop } from '@/types/models';

const API_BASE = '/api/shops';

export const ShopsAPI = {
  async list(filters?: { status?: string; search?: string }) {
    const response = await axios.get(API_BASE, { params: filters });
    return response.data as Shop[];
  },

  async create(data: Partial<Shop>) {
    const response = await axios.post(API_BASE, data);
    return response.data as Shop;
  },

  async update(id: string, data: Partial<Shop>) {
    const response = await axios.patch(`${API_BASE}/${id}`, data);
    return response.data as Shop;
  },

  async delete(id: string) {
    await axios.delete(`${API_BASE}/${id}`);
  },

  async bulkUpdate(ids: string[], data: Partial<Shop>) {
    const response = await axios.patch(`${API_BASE}/bulk`, {
      ids,
      ...data
    });
    return response.data as Shop[];
  },

  async getStats(id: string) {
    const response = await axios.get(`${API_BASE}/${id}/stats`);
    return response.data;
  },

  async addIntegration(id: string, integration: PrintProviderIntegration) {
    const response = await axios.post(
      `${API_BASE}/${id}/integrations`,
      integration
    );
    return response.data;
  },

  async removeIntegration(id: string, integrationId: string) {
    await axios.delete(
      `${API_BASE}/${id}/integrations/${integrationId}`
    );
  },

  async testIntegration(id: string, integrationId: string) {
    const response = await axios.post(
      `${API_BASE}/${id}/integrations/${integrationId}/test`
    );
    return response.data;
  }
};
