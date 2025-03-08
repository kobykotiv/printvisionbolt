import { Provider, Product, Variant, Template } from './types';

export class PodApiAggregator {
  private providers: Provider[] = [];
  private templates: Template[] = [];

  async getProviders(): Promise<Provider[]> {
    return this.providers;
  }

  async connectProvider(providerId: string, apiKey: string): Promise<void> {
    // Connect provider and update provider status
    this.providers = this.providers.map(p => 
      p.id === providerId 
        ? { ...p, status: 'connected', lastSynced: new Date().toISOString() }
        : p
    );
  }

  async syncProvider(providerId: string): Promise<void> {
    // Sync provider data and update last synced timestamp
    this.providers = this.providers.map(p =>
      p.id === providerId
        ? { ...p, lastSynced: new Date().toISOString() }
        : p
    );
  }

  async disconnectProvider(providerId: string): Promise<void> {
    // Disconnect provider and reset provider data
    this.providers = this.providers.map(p =>
      p.id === providerId
        ? { ...p, status: 'disconnected', lastSynced: null, products: 0 }
        : p
    );
  }

  async getTemplates(): Promise<Template[]> {
    return this.templates;
  }

  async createTemplate(template: Template): Promise<void> {
    this.templates.push(template);
  }

  async updateTemplate(templateId: string, updates: Partial<Template>): Promise<void> {
    this.templates = this.templates.map(t =>
      t.id === templateId
        ? { ...t, ...updates }
        : t
    );
  }

  async deleteTemplate(templateId: string): Promise<void> {
    this.templates = this.templates.filter(t => t.id !== templateId);
  }
}