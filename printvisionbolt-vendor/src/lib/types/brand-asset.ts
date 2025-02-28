export type AssetType = 'logo' | 'icon' | 'banner' | 'pattern' | 'guideline';
export type AssetFormat = 'jpg' | 'png' | 'svg';
export type AssetStatus = 'active' | 'archived' | 'pending';

export interface AssetMetadata {
  width: number;
  height: number;
  format: AssetFormat;
  fileSize: number;
  createdAt: string;
  modifiedAt: string;
  owner: string;
  usageRights: {
    license: string;
    expiresAt?: string;
    restrictions?: string[];
  };
}

export interface AssetVersion {
  id: string;
  assetId: string;
  version: number;
  url: string;
  metadata: AssetMetadata;
  createdAt: string;
  createdBy: string;
  notes?: string;
}

export interface BrandAsset {
  id: string;
  brandId: string;
  type: AssetType;
  name: string;
  description?: string;
  primaryUrl: string;
  thumbnailUrl: string;
  status: AssetStatus;
  metadata: AssetMetadata;
  versions: AssetVersion[];
  tags: {
    primary: string[];
    secondary: string[];
  };
  usage: {
    products: string[];
    collections: string[];
    templates: string[];
  };
}
