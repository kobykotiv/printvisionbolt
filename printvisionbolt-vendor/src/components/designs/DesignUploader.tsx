import React from 'react';
import { Upload, X, AlertTriangle } from 'lucide-react';
import type { TemplateDesign } from '../../lib/types/template';
import { Modal } from '../ui/Modal';

export interface DesignUploaderProps {
  onUploadComplete: (designs: Partial<TemplateDesign>[]) => Promise<void>;
  allowedTypes: string[];
  maxFileSize: number;
  isOpen: boolean;
  onClose: () => void;
}

interface UploadItem {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export function DesignUploader({
  onUploadComplete,
  allowedTypes,
  maxFileSize,
  isOpen,
  onClose
}: DesignUploaderProps) {
  const [uploads, setUploads] = React.useState<UploadItem[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        console.error(`Invalid file type: ${file.type}`);
        return false;
      }
      if (file.size > maxFileSize) {
        console.error(`File too large: ${file.name}`);
        return false;
      }
      return true;
    });

    const newUploads: UploadItem[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'pending'
    }));

    setUploads(prev => [...prev, ...newUploads]);
  };

  const processUpload = async (item: UploadItem): Promise<Partial<TemplateDesign>> => {
    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploads(prev =>
          prev.map(upload =>
            upload.id === item.id
              ? { ...upload, progress, status: 'uploading' }
              : upload
          )
        );
      }

      // In a real implementation, you would upload to your storage service here
      const design: Partial<TemplateDesign> = {
        name: item.file.name,
        thumbnailUrl: URL.createObjectURL(item.file)
      };

      setUploads(prev =>
        prev.map(upload =>
          upload.id === item.id
            ? { ...upload, progress: 100, status: 'success' }
            : upload
        )
      );

      return design;
    } catch (error) {
      setUploads(prev =>
        prev.map(upload =>
          upload.id === item.id
            ? {
                ...upload,
                status: 'error',
                error: error instanceof Error ? error.message : 'Upload failed'
              }
            : upload
        )
      );
      throw error;
    }
  };

  const handleUpload = async () => {
    if (isUploading || uploads.length === 0) return;

    setIsUploading(true);
    const results: Partial<TemplateDesign>[] = [];
    const pendingUploads = uploads.filter(u => u.status === 'pending');

    try {
      // Process uploads in parallel, but limit concurrency
      const concurrencyLimit = 3;
      for (let i = 0; i < pendingUploads.length; i += concurrencyLimit) {
        const batch = pendingUploads.slice(i, i + concurrencyLimit);
        const uploadPromises = batch.map(processUpload);
        const batchResults = await Promise.allSettled(uploadPromises);
        
        batchResults.forEach(result => {
          if (result.status === 'fulfilled') {
            results.push(result.value);
          }
        });
      }

      await onUploadComplete(results);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveUpload = (id: string) => {
    setUploads(prev => prev.filter(upload => upload.id !== id));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Designs"
    >
      <div className="space-y-6">
        <div className="border-2 border-dashed rounded-lg p-6">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={allowedTypes.join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center space-y-2"
          >
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">
              Click to select files or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              Maximum file size: {Math.round(maxFileSize / (1024 * 1024))}MB
            </p>
          </button>
        </div>

        {uploads.length > 0 && (
          <div className="space-y-4">
            <div className="divide-y">
              {uploads.map(upload => (
                <div
                  key={upload.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div className="flex-1 mr-4">
                    <p className="text-sm font-medium text-gray-900">
                      {upload.file.name}
                    </p>
                    <div className="mt-1 relative">
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div
                          className={`h-2 rounded-full ${
                            upload.status === 'error'
                              ? 'bg-red-500'
                              : 'bg-indigo-500'
                          }`}
                          style={{ width: `${upload.progress}%` }}
                        />
                      </div>
                    </div>
                    {upload.error && (
                      <p className="mt-1 text-xs text-red-500 flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {upload.error}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveUpload(upload.id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading || uploads.length === 0}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}