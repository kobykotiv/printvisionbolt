export interface Design {
  id: string;
  title: string;
  imageUrl: string;
  tags: string[];
  supplierIds: string[];
  collections: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  isSmartCollection: boolean;
  rules?: CollectionRule[];
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CollectionRule {
  field: 'tag' | 'title' | 'supplierIds';
  operator: 'contains' | 'equals' | 'startsWith';
  value: string;
}
