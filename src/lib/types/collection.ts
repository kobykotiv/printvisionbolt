import { Design, DesignMetadata, DesignPermissions } from './design';

export interface CollectionBase {
  id: string;
  name: string;
  parentId?: string;
  path: string[];
  level: number;
  sortOrder: number;
  metadata: CollectionMetadata;
  permissions: CollectionPermissions;
}

export interface Collection extends CollectionBase {
  designs: string[];
  subCollections: string[];
}

export interface CollectionWithRelations extends CollectionBase {
  designs: Design[];
  subCollections: Collection[];
  parent?: Collection;
}

export interface CollectionHierarchyNode extends CollectionBase {
  children: never[];
  designs: string[];
  subCollections: string[];
  hasChildren: boolean;
  childCount: number;
  designCount: number;
  inheritedDesignCount: number;
  description?: string;
  tags?: string[];
}

export interface CollectionCreateInput {
  name: string;
  parentId?: string;
  designs?: string[];
  subCollections?: string[];
}

export interface CollectionUpdateInput {
  name?: string;
  parentId?: string;
  metadata?: Partial<CollectionMetadata>;
  permissions?: Partial<CollectionPermissions>;
}

export interface CollectionMove {
  sourceId: string;
  targetId: string;
  position?: number;
}

export type CollectionOperationType = 'move' | 'copy' | 'delete' | 'updatePermissions';

export interface BatchCollectionOperation {
  operation: CollectionOperationType;
  collectionIds: string[];
  targetId?: string;
  permissions?: Partial<CollectionPermissions>;
}

export type BatchDesignOperationType = 'move' | 'copy' | 'delete' | 'updatePermissions' | 'updateMetadata';

export interface BatchDesignOperation {
  operation: BatchDesignOperationType;
  designIds: string[];
  targetCollectionId?: string | null;
  permissions?: Partial<DesignPermissions>;
  metadata?: Partial<DesignMetadata>;
}

export interface CollectionMetadata {
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
  version: number;
  accessCount: number;
  lastAccessedAt: Date;
}

export interface CollectionPermissions {
  read: string[];
  write: string[];
  admin: string[];
  share: string[];
  delete: string[];
  managePermissions: string[];
}
