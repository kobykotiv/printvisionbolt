export interface BulkUpload {
  id: string;
  shop_id: string;
  user_id: string;
  name: string;
  description?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  total_files: number;
  processed_files: number;
  failed_files: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  items?: BulkUploadItem[];
}

export interface BulkUploadItem {
  id: string;
  upload_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  metadata: Record<string, unknown>;
  design_id?: string;
  created_at: string;
  updated_at: string;
}

export interface BulkUploadConfig {
  name: string;
  description?: string;
  providers: string[];
  metadata?: {
    category?: string;
    tags?: string[];
    template?: string;
  };
}