import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Design } from '../../lib/types/design';
import { TEST_MODE } from '../../lib/test-mode';

interface DesignUploaderProps {
  onUpload: (designs: Design[]) => void;
  multiple?: boolean;
  className?: string;
}

export function DesignUploader({ onUpload, multiple = true, className }: DesignUploaderProps) {
  const [uploading, setUploading] = React.useState(false);
  const [preview, setPreview] = React.useState<string[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: async (acceptedFiles) => {
      setUploading(true);
      try {
        if (TEST_MODE) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          const mockDesigns: Design[] = acceptedFiles.map((file, index) => ({
            id: `design-${Date.now()}-${index}`,
            title: file.name,
            description: '',
            fileUrl: URL.createObjectURL(file),
            thumbnailUrl: URL.createObjectURL(file),
            tags: [],
            status: 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            metadata: {
              width: 1200,
              height: 1200,
              dpi: 300,
              format: file.type.split('/')[1],
              fileSize: file.size
            }
          }));
          onUpload(mockDesigns);
          setPreview(mockDesigns.map(d => d.thumbnailUrl!));
          return;
        }

        // In a real app, upload files to your storage
        const designs: Design[] = [];
        for (const file of acceptedFiles) {
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await fetch('/api/designs/upload', {
            method: 'POST',
            body: formData
          });
          
          const design = await response.json();
          designs.push(design);
        }
        
        onUpload(designs);
        setPreview(designs.map(d => d.thumbnailUrl!));
      } catch (error) {
        console.error('Error uploading designs:', error);
      } finally {
        setUploading(false);
      }
    }
  });

  const removePreview = (index: number) => {
    setPreview(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300",
          uploading && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} disabled={uploading} />
        {uploading ? (
          <div>
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
            <p className="mt-2 text-sm text-gray-600">Uploading designs...</p>
          </div>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              {isDragActive
                ? "Drop the files here..."
                : "Drag and drop design files here, or click to select files"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG up to 10MB
            </p>
          </>
        )}
      </div>

      {preview.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {preview.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="h-24 w-24 object-cover rounded-lg"
              />
              <button
                onClick={() => removePreview(index)}
                className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}