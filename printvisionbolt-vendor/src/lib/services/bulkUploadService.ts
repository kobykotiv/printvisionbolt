import { supabase } from '../supabase';
import type { BulkUpload, BulkUploadItem } from '../types/bulk-upload';

export class BulkUploadService {
  async createUpload(shopId: string, name: string, description?: string): Promise<BulkUpload> {
    const { data, error } = await supabase
      .from('bulk_uploads')
      .insert({
        shop_id: shopId,
        name,
        description,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async addUploadItems(uploadId: string, files: File[]): Promise<BulkUploadItem[]> {
    const items = files.map(file => ({
      upload_id: uploadId,
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      status: 'pending'
    }));

    const { data, error } = await supabase
      .from('bulk_upload_items')
      .insert(items)
      .select();

    if (error) throw error;
    return data;
  }

  async processUploadItem(item: BulkUploadItem, file: File): Promise<void> {
    try {
      // 1. Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${item.upload_id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('designs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('designs')
        .getPublicUrl(filePath);

      // 3. Create design record
      const { data: design, error: designError } = await supabase
        .from('designs')
        .insert({
          name: file.name,
          file_url: publicUrl,
          thumbnail_url: publicUrl,
          metadata: {
            width: 0,
            height: 0,
            format: fileExt?.toUpperCase(),
            fileSize: file.size,
            dpi: 300,
            colorSpace: 'RGB',
            hasTransparency: fileExt === 'png'
          }
        })
        .select()
        .single();

      if (designError) throw designError;

      // 4. Update upload item status
      const { error: updateError } = await supabase
        .from('bulk_upload_items')
        .update({
          status: 'success',
          design_id: design.id
        })
        .eq('id', item.id);

      if (updateError) throw updateError;

    } catch (error) {
      // Update item with error status
      await supabase
        .from('bulk_upload_items')
        .update({
          status: 'error',
          error: error instanceof Error ? error.message : 'Upload failed'
        })
        .eq('id', item.id);

      throw error;
    }
  }

  async getUpload(id: string): Promise<BulkUpload> {
    const { data, error } = await supabase
      .from('bulk_uploads')
      .select(`
        *,
        items:bulk_upload_items(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async syncWithProvider(designId: string, provider: string): Promise<void> {
    const { error } = await supabase
      .from('sync_providers')
      .insert({
        design_id: designId,
        provider,
        sync_status: 'pending'
      });

    if (error) throw error;
  }
}

export const bulkUploadService = new BulkUploadService();