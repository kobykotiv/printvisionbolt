export interface Shop {
  id: string;
  name: string;
  status: 'active' | 'disabled';
  integrations: PrintProviderIntegration[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  tags: string[];
  blueprintId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Design {
  id: string;
  name: string;
  previewUrl: string;
  tags: string[];
  colorPalette: string[];
  templateIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Collection {
  id: string;
  name: string;
  parentId?: string;
  items: Array<{
    type: 'design' | 'collection';
    id: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrintProviderIntegration {
  provider: 'printify' | 'printful' | 'gooten';
  apiKey: string;
  status: 'active' | 'error';
  lastSync: Date;
}

export interface SyncConfig {
  enabled: boolean;
  schedule: 'hourly' | 'daily' | 'weekly';
  includedShops: string[];
  lastRun: Date;
}
