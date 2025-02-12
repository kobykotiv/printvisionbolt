import React from 'react';
import { Plus, Search, Filter, Grid, List, Upload } from 'lucide-react';
import { AssetUploader } from '../components/brand-assets/AssetUploader';
import { AssetVersionHistory } from '../components/brand-assets/AssetVersionHistory';
import { AssetUsageTracker } from '../components/brand-assets/AssetUsageTracker';
import { AssetMetadataEditor } from '../components/brand-assets/AssetMetadataEditor';
import { Modal } from '../components/ui/Modal';
import type { BrandAsset, AssetVersion } from '../lib/types/brand-asset';
import { cn } from '../lib/utils';

type ViewMode = 'grid' | 'list';
type ModalType = 'upload' | 'edit' | 'version-history' | null;

const MOCK_ASSETS: Asset[] = [
  {
    id: '1',
    title: 'Summer Collection Logo',
    thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400',
    type: 'Logo',
    status: 'synced',
    lastModified: '2024-02-20',
    usageCount: 12
  },
  {
    id: '2',
    title: 'Urban Style Template',
    thumbnail: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?auto=format&fit=crop&q=80&w=400',
    type: 'Template',
    status: 'pending',
    lastModified: '2024-02-19',
    usageCount: 5
  },
  {
    id: '3',
    title: 'Brand Guidelines',
    thumbnail: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=400',
    type: 'Document',
    status: 'error',
    lastModified: '2024-02-18',
    usageCount: 8
  },
  // Add more mock assets as needed
];

export function BrandAssets() {
  const [assets, setAssets] = React.useState<BrandAsset[]>([]);
  const [viewMode, setViewMode] = React.useState<ViewMode>('grid');
  const [modalType, setModalType] = React.useState<ModalType>(null);
  const [currentAsset, setCurrentAsset] = React.useState<BrandAsset | null>(null);
  const [selectedAssets, setSelectedAssets] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState({
    type: [] as string[],
    status: [] as string[]
  });

  const handleUpload = async (files: File[]) => {
    // Implementation for file upload
  };

  const handleRevertVersion = async (version: AssetVersion) => {
    // Implementation for version revert
  };

  const handleDownloadVersion = (version: AssetVersion) => {
    // Implementation for version download
  };

  const handleUpdateMetadata = async (metadata: AssetMetadata) => {
    // Implementation for metadata update
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Brand Assets</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-2 rounded-md",
                viewMode === 'grid'
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-2 rounded-md",
                viewMode === 'list'
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={() => setModalType('upload')}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Upload className="h-5 w-5 mr-2" />
            Upload Assets
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          <Filter className="h-5 w-5 mr-2" />
          Filter
        </button>
      </div>

      {/* Asset Grid/List */}
      {/* Implementation of grid/list view */}

      {/* Modals */}
      <Modal
        isOpen={modalType === 'upload'}
        onClose={() => setModalType(null)}
        title="Upload Assets"
      >
        <AssetUploader onUpload={handleUpload} />
      </Modal>

      <Modal
        isOpen={modalType === 'version-history'}
        onClose={() => setModalType(null)}
        title="Version History"
      >
        {currentAsset && (
          <AssetVersionHistory
            versions={currentAsset.versions}
            onRevert={handleRevertVersion}
            onDownload={handleDownloadVersion}
          />
        )}
      </Modal>

      <Modal
        isOpen={modalType === 'edit'}
        onClose={() => setModalType(null)}
        title="Edit Asset"
      >
        {currentAsset && (
          <div className="space-y-6">
            <AssetMetadataEditor
              metadata={currentAsset.metadata}
              onSave={handleUpdateMetadata}
            />
            <AssetUsageTracker asset={currentAsset} />
          </div>
        )}
      </Modal>
    </div>
  );
}
