import axios from 'axios';

export class PrintProviderAPI {
  constructor(private provider: string, private apiKey: string) {}

  async getBlueprints() {
    switch (this.provider) {
      case 'printify':
        return await this.getPrintifyBlueprints();
      case 'printful':
        return await this.getPrintfulBlueprints();
      case 'gooten':
        return await this.getGootenBlueprints();
      default:
        throw new Error(`Unsupported provider: ${this.provider}`);
    }
  }

  private async getPrintifyBlueprints() {
    const response = await axios.get('https://api.printify.com/v1/catalog.json', {
      headers: { Authorization: `Bearer ${this.apiKey}` }
    });
    return this.normalizeBlueprints(response.data);
  }

  // ... Similar methods for Printful and Gooten

  private normalizeBlueprints(data: any) {
    // Convert provider-specific format to our standard format
    return data.map((blueprint: any) => ({
      id: blueprint.id,
      name: blueprint.title,
      provider: this.provider,
      variants: blueprint.variants,
      metadata: blueprint
    }));
  }
}
