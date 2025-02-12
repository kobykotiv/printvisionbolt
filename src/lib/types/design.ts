export interface Design {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  thumbnailUrl?: string;
  tags: string[];
  status: 'draft' | 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
  metadata: {
    width: number;
    height: number;
    dpi: number;
    format: string;
    fileSize: number;
  };
  supplierIds?: Record<string, string>; // Map of supplier to their design ID
}

export interface DesignWithStats extends Design {
  usageCount: number;
  syncStatus: Record<string, {
    status: 'synced' | 'pending' | 'error';
    lastSync?: string;
    error?: string;
  }>;
}
