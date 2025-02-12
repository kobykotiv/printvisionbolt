export interface Design {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  metadata: {
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
  };
  status: 'active' | 'archived' | 'draft';
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
}

// Mock design data
export const mockDesigns: Design[] = [
  {
    id: 'design-1',
    name: 'Modern Abstract Pattern',
    description: 'Geometric shapes in soft pastel colors',
    thumbnailUrl: '/mock/designs/abstract-1.jpg',
    category: 'Patterns',
    tags: ['modern', 'abstract', 'geometric', 'pastel'],
    metadata: {
      width: 4000,
      height: 4000,
      format: 'PNG',
      fileSize: 2.4 * 1024 * 1024,
      dpi: 300,
      colorSpace: 'RGB',
      hasTransparency: true,
      style: 'Modern',
      industry: 'Fashion'
    },
    status: 'active',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z'
  },
  {
    id: 'design-2',
    name: 'Vintage Floral Bouquet',
    description: 'Hand-drawn botanical illustration',
    thumbnailUrl: '/mock/designs/floral-1.jpg',
    category: 'Illustrations',
    tags: ['vintage', 'floral', 'botanical', 'hand-drawn'],
    metadata: {
      width: 3600,
      height: 4800,
      format: 'PNG',
      fileSize: 3.1 * 1024 * 1024,
      dpi: 300,
      colorSpace: 'RGB',
      hasTransparency: true,
      style: 'Vintage',
      industry: 'Home Decor'
    },
    status: 'active',
    createdAt: '2025-01-20T14:30:00Z',
    updatedAt: '2025-02-01T09:15:00Z'
  },
  {
    id: 'design-3',
    name: 'Urban Streetwear Logo',
    description: 'Bold typography with grunge texture',
    thumbnailUrl: '/mock/designs/logo-1.jpg',
    category: 'Logos',
    tags: ['streetwear', 'urban', 'grunge', 'typography'],
    metadata: {
      width: 2400,
      height: 2400,
      format: 'PNG',
      fileSize: 1.8 * 1024 * 1024,
      dpi: 300,
      colorSpace: 'RGB',
      hasTransparency: true,
      style: 'Urban',
      industry: 'Fashion'
    },
    status: 'active',
    createdAt: '2025-02-01T16:45:00Z',
    updatedAt: '2025-02-01T16:45:00Z'
  },
  {
    id: 'design-4',
    name: 'Minimalist Mountain Scene',
    description: 'Simple line art landscape',
    thumbnailUrl: '/mock/designs/landscape-1.jpg',
    category: 'Illustrations',
    tags: ['minimalist', 'landscape', 'mountains', 'line-art'],
    metadata: {
      width: 3200,
      height: 2400,
      format: 'PNG',
      fileSize: 1.2 * 1024 * 1024,
      dpi: 300,
      colorSpace: 'RGB',
      hasTransparency: true,
      style: 'Minimalist',
      industry: 'Outdoor'
    },
    status: 'active',
    createdAt: '2025-02-05T11:20:00Z',
    updatedAt: '2025-02-05T11:20:00Z'
  },
  {
    id: 'design-5',
    name: 'Pop Art Comic Style',
    description: 'Retro comic book inspired pattern',
    thumbnailUrl: '/mock/designs/popart-1.jpg',
    category: 'Patterns',
    tags: ['pop-art', 'comic', 'retro', 'colorful'],
    metadata: {
      width: 4800,
      height: 4800,
      format: 'PNG',
      fileSize: 4.5 * 1024 * 1024,
      dpi: 300,
      colorSpace: 'RGB',
      hasTransparency: true,
      style: 'Pop Art',
      industry: 'Entertainment'
    },
    status: 'active',
    createdAt: '2025-02-07T09:30:00Z',
    updatedAt: '2025-02-07T09:30:00Z'
  }
];

export interface DesignSearchResult {
  id: string;
  name: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  updatedAt: string;
}

export interface DesignSearchResponse {
  results: DesignSearchResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
