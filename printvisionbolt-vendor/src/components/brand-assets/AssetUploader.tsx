import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { AssetFormat } from '../../lib/types/brand-asset';

interface AssetUploaderProps {
  onUpload: (files: File[]) => Promise<void>;
  allowedFormats?: AssetFormat[];
  maxSize?: number;
  className?: string;
}

export function AssetUploader({
  onUpload,
  allowedFormats = ['jpg', 'png', 'svg'],
  maxSize = 50 * 1024 * 1024, // 50MB default
  className
}: AssetUploaderProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/svg+xml': ['.svg']
    },
    maxSize,
    onDrop: async (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map(f => f.errors[0].message).join(', ');
        setError(`Invalid files: ${errors}`);
        return;
      }

      setError(null);
      setUploading(true);
      try {
        await onUpload(acceptedFiles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setUploading(false);
      }
    }
  });

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300",
          uploading && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <input {...getInputProps()} disabled={uploading} />
        {uploading ? (
          <div>
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            <p className="mt-2 text-sm text-gray-600">Uploading assets...</p>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              {isDragActive
                ? "Drop the files here..."
                : "Drag and drop files here, or click to select files"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Supported formats: {allowedFormats.join(', ').toUpperCase()}
              <br />
              Maximum file size: {Math.floor(maxSize / 1024 / 1024)}MB
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}