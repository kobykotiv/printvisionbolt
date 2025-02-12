export type PodProvider = 'printify' | 'printful' | 'gooten' | 'gelato' | 'prodigi';

export type Environment = 'production' | 'sandbox';

export interface Store {
  id: string;
  name: string;
  provider: PodProvider;
}

export interface PodConnection {
  id: string;
  provider: PodProvider;
  apiKey: string;
  storeId?: string;
  environment: Environment;
  isActive: boolean;
  lastSyncedAt?: string;
  status: 'connected' | 'disconnected' | 'error';
  error?: string;
}

export interface SyncSettings {
  autoSync: boolean;
  syncInterval: number; // in minutes
  syncProducts: boolean;
  syncInventory: boolean;
  syncPricing: boolean;
  notifyOnError: boolean;
}

export interface PodIntegrationConfig {
  connection: PodConnection;
  syncSettings: SyncSettings;
}
