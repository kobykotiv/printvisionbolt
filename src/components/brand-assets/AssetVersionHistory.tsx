import React from 'react';
import { Clock, Download, RotateCcw } from 'lucide-react';
import type { AssetVersion } from '../../lib/types/brand-asset';

interface AssetVersionHistoryProps {
  versions: AssetVersion[];
  onRevert: (version: AssetVersion) => Promise<void>;
  onDownload: (version: AssetVersion) => void;
}

export function AssetVersionHistory({
  versions,
  onRevert,
  onDownload
}: AssetVersionHistoryProps) {
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleRevert = async (version: AssetVersion) => {
    setLoading(version.id);
    try {
      await onRevert(version);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Version History</h3>
      <div className="space-y-2">
        {versions.map((version) => (
          <div
            key={version.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg border"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden">
                <img
                  src={version.url}
                  alt={`Version ${version.version}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Version {version.version}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  {new Date(version.createdAt).toLocaleString()}
                </div>
                {version.notes && (
                  <p className="mt-1 text-sm text-gray-600">{version.notes}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDownload(version)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleRevert(version)}
                disabled={loading === version.id}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full disabled:opacity-50"
              >
                <RotateCcw className={cn(
                  "h-5 w-5",
                  loading === version.id && "animate-spin"
                )} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}