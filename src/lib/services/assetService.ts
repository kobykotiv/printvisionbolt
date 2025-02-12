import { supabase } from '../supabase';
import type { BrandAsset, AssetVersion, AssetMetadata, AssetType, AssetFormat } from '../types/brand-asset';

export interface UploadProgress {
  file: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

export type UploadProgressCallback = (progress: UploadProgress[]) => void;

interface AssetUploadOptions {
  brandId: string;
  type: AssetType;
  files: File[];
  metadata?: Partial<AssetMetadata>;
  onProgress?: UploadProgressCallback;
}

export async function uploadAssets({
  brandId,
  type,
  files,
  metadata = {},
  onProgress
}: AssetUploadOptions): Promise<BrandAsset[]> {
  const assets: BrandAsset[] = [];
  const progress: UploadProgress[] = files.map(file => ({
    file: file.name,
    progress: 0,
    status: 'pending'
  }));

  const updateProgress = (index: number, updates: Partial<UploadProgress>) => {
    progress[index] = { ...progress[index], ...updates };
    onProgress?.(progress);
  };

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      updateProgress(i, { status: 'uploading', progress: 10 });

      // 1. Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('brand-assets')
        .upload(`${brandId}/${file.name}`, file, {
          upsert: true
        });

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
      updateProgress(i, { progress: 50 });

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('brand-assets')
        .getPublicUrl(uploadData.path);

      updateProgress(i, { progress: 60 });

      // 3. Generate thumbnail
      const thumbnailUrl = await generateThumbnail(file);
      updateProgress(i, { progress: 70 });

      // 4. Extract metadata
      const fileMetadata = await extractMetadata(file);
      updateProgress(i, { progress: 80 });

      // 5. Create asset record
      const { data: asset, error: assetError } = await supabase
        .from('brand_assets')
        .insert({
          brandId,
          type,
          name: file.name,
          primaryUrl: publicUrl,
          thumbnailUrl,
          status: 'active',
          metadata: {
            ...fileMetadata,
            ...metadata,
            createdAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
          }
        })
        .select()
        .single();

      if (assetError) throw new Error(`Failed to create asset: ${assetError.message}`);
      updateProgress(i, { progress: 90 });

      // 6. Create initial version
      const { error: versionError } = await supabase
        .from('asset_versions')
        .insert({
          assetId: asset.id,
          version: 1,
          url: publicUrl,
          metadata: asset.metadata,
          createdAt: new Date().toISOString(),
          createdBy: metadata.owner || 'system'
        });

      if (versionError) throw new Error(`Failed to create version: ${versionError.message}`);

      assets.push(asset);
      updateProgress(i, { status: 'complete', progress: 100 });
    } catch (error) {
      updateProgress(i, {
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed',
        progress: 0
      });
    }
  }

  return assets;
}

async function generateThumbnail(file: File): Promise<string> {
  // TODO: Implement actual thumbnail generation
  // For now, return the original file URL
  return URL.createObjectURL(file);
}

async function extractMetadata(file: File): Promise<AssetMetadata> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve({
        width: img.width,
        height: img.height,
        format: file.type.split('/')[1] as AssetFormat,
        fileSize: file.size,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
        owner: 'system', // TODO: Get from auth context
        usageRights: {
          license: 'private'
        }
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image for metadata extraction'));
    };
    img.src = URL.createObjectURL(file);
  });
}

export async function getAssetVersions(assetId: string): Promise<AssetVersion[]> {
  const { data, error } = await supabase
    .from('asset_versions')
    .select('*')
    .eq('assetId', assetId)
    .order('version', { ascending: false });

  if (error) throw new Error(`Failed to fetch versions: ${error.message}`);
  return data;
}

export async function createAssetVersion(
  assetId: string,
  file: File,
  notes?: string
): Promise<AssetVersion> {
  // 1. Get current version number
  const { data: versions, error: versionsError } = await supabase
    .from('asset_versions')
    .select('version')
    .eq('assetId', assetId)
    .order('version', { ascending: false })
    .limit(1);

  if (versionsError) throw new Error(`Failed to get version number: ${versionsError.message}`);
  const nextVersion = versions?.[0]?.version ? versions[0].version + 1 : 1;

  // 2. Upload new file
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('brand-assets')
    .upload(`${assetId}/v${nextVersion}/${file.name}`, file, {
      upsert: true
    });

  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

  // 3. Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('brand-assets')
    .getPublicUrl(uploadData.path);

  // 4. Extract metadata
  const metadata = await extractMetadata(file);

  // 5. Create version record
  const { data: version, error: versionError } = await supabase
    .from('asset_versions')
    .insert({
      assetId,
      version: nextVersion,
      url: publicUrl,
      metadata,
      notes,
      createdAt: new Date().toISOString(),
      createdBy: metadata.owner || 'system'
    })
    .select()
    .single();

  if (versionError) throw new Error(`Failed to create version: ${versionError.message}`);
  return version;
}

export async function restoreAssetVersion(assetId: string, versionId: string): Promise<void> {
  const { data: version, error: versionError } = await supabase
    .from('asset_versions')
    .select('*')
    .eq('id', versionId)
    .single();

  if (versionError) throw new Error(`Failed to fetch version: ${versionError.message}`);

  const { error: updateError } = await supabase
    .from('brand_assets')
    .update({
      primaryUrl: version.url,
      metadata: version.metadata,
      modifiedAt: new Date().toISOString()
    })
    .eq('id', assetId);

  if (updateError) throw new Error(`Failed to restore version: ${updateError.message}`);
}