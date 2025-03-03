import type { PodProvider } from './pod';

export interface BlueprintVariant {
  id: string;
  title: string;
  sku: string;
  options: Record<string, string>;
  pricing?: {
    baseCost?: number;
    retailPrice?: number;
  };
}

export interface BlueprintPlaceholder {
  id: string;
  name: string;
  width: number;
  height: number;
  x: number;
  y: number;
  rotation: number;
  required: boolean;
  constraints: {
    minDpi: number;
    maxDpi: number;
    allowedFormats: string[];
  };
}

export interface PlaceholderMapping {
  id: string;
  placeholderId: string;
  designId: string;
  scale: number;
  rotation: number;
  position: {
    x: number;
    y: number;
  };
}

export interface Blueprint {
  id: string;
  title: string;
  description?: string;
  providerId: string;
  provider: PodProvider;
  variants: BlueprintVariant[];
  placeholders: BlueprintPlaceholder[];
  pricing: {
    baseCost: number;
    retailPrice: number;
  };
}

export type TemplateStatus = 'draft' | 'active' | 'archived';

export interface TemplateDesign {
  id: string;
  templateId: string;
  designId: string;
  blueprintId: string;
  name: string;
  thumbnailUrl?: string;
  placeholders: Array<{
    id: string;
    name: string;
    designId: string;
  }>;
  mappings: PlaceholderMapping[];
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export type SyncStatus = 'idle' | 'syncing' | 'error';

export interface TemplateSyncState {
  status: SyncStatus;
  lastSyncAt?: string;
  nextSyncAt?: string;
  error?: string;
}

export interface Template {
  id: string;
  title: string;
  description?: string;
  designs: TemplateDesign[];
  blueprints: Blueprint[];
  tags: string[];
  status: TemplateStatus;
  syncState?: TemplateSyncState;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateWithStats extends Template {
  productCount: number;
  designCount: number;
  syncStats: {
    pendingDesigns: number;
    errorDesigns: number;
    lastSuccessfulSync?: string;
    averageProcessingTime: number;
  };
}

export interface BatchOperationItem<T = unknown> {
  id?: string;
  data: T;
}

export interface BatchOperation<T = unknown> {
  type: 'create' | 'update' | 'delete';
  items: BatchOperationItem<T>[];
  options?: {
    continueOnError?: boolean;
    parallelLimit?: number;
  };
}

export interface BatchResult<T = unknown> {
  successful: Array<{
    id: string;
    data: T;
  }>;
  failed: Array<{
    id?: string;
    error: string;
    data?: T;
  }>;
  stats: {
    total: number;
    succeeded: number;
    failed: number;
    timeElapsed: number;
  };
}

export interface TemplateService {
  createTemplate(template: Partial<Template>): Promise<Template>;
  updateTemplate(id: string, template: Partial<Template>): Promise<Template>;
  deleteTemplate(id: string): Promise<void>;
  getTemplate(id: string): Promise<Template>;
  listTemplates(filters?: {
    status?: TemplateStatus;
    tags?: string[];
    search?: string;
  }): Promise<Template[]>;
  addDesignsToTemplate(
    templateId: string, 
    designs: Partial<TemplateDesign>[]
  ): Promise<BatchResult<TemplateDesign>>;
  syncTemplate(templateId: string): Promise<TemplateSyncState>;
  getTemplateSyncStatus(templateId: string): Promise<TemplateSyncState>;
}
