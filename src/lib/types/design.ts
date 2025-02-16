export interface DesignVersionHistory {
  version: number;
  timestamp: Date;
  userId: string;
  changes: string;
  metadata: DesignMetadata;
  previousVersion?: number;
  restoredFrom?: number;
}

export interface DesignMetadata {
  width: number;
  height: number;
  format: string;
  fileSize: number;
  dpi: number;
  colorSpace: 'RGB' | 'CMYK';
  hasTransparency: boolean;
  industry?: string;
  style?: string;
  customData?: Record<string, unknown>;
}

export interface DesignCollectionMembership {
  collectionId: string;
  addedAt: Date;
  addedBy: string;
  order: number;
  inherited: boolean;
  sourceCollectionId?: string;
}

export interface DesignPermissions {
  read: string[];
  write: string[];
  admin: string[];
}

export interface Design {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  metadata: DesignMetadata;
  status: 'active' | 'archived' | 'draft';
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
  version: number;
  versionHistory: DesignVersionHistory[];
  permissions: DesignPermissions;
  collectionMemberships: DesignCollectionMembership[];
}

export interface DesignSearchParams {
  query?: string;
  category?: string;
  tags?: string[];
  collections?: string[];
  status?: 'active' | 'archived' | 'draft';
  dateRange?: {
    start: string;
    end: string;
  };
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'lastUsedAt';
  sortDirection?: 'asc' | 'desc';
}

export interface DesignSearchResult {
  id: string;
  name: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  updatedAt: string;
  collections: string[];
}

export interface DesignSearchResponse {
  results: DesignSearchResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

export interface BatchDesignOperation {
  operation: 'move' | 'copy' | 'delete' | 'updatePermissions' | 'updateMetadata';
  designIds: string[];
  targetCollectionId?: string;
  permissions?: Partial<DesignPermissions>;
  metadata?: Partial<DesignMetadata>;
}

export type DesignCreateInput = Omit<Design, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'versionHistory'>;

export type DesignUpdateInput = Partial<Omit<Design, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'versionHistory'>>;

export interface DesignVersionInfo {
  version: number;
  timestamp: string;
  userId: string;
  changes: string[];
}

export interface DesignStats {
  totalDesigns: number;
  activeDesigns: number;
  archivedDesigns: number;
  draftDesigns: number;
  designsByCategory: Record<string, number>;
  designsByCollection: Record<string, number>;
  mostUsedTags: Array<{ tag: string; count: number }>;
}
