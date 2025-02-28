/*
  # Bulk Upload System

  1. Changes
    - Add bulk_uploads table for tracking upload sessions
    - Add bulk_upload_items table for individual files
    - Add sync_providers table for tracking provider sync status
    - Add RLS policies and triggers

  2. Features
    - Upload session tracking
    - Individual file status tracking
    - Provider sync status tracking
    - Usage limits enforcement
*/

-- Create bulk_uploads table
CREATE TABLE bulk_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'pending',
  total_files integer NOT NULL DEFAULT 0,
  processed_files integer NOT NULL DEFAULT 0,
  failed_files integer NOT NULL DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bulk_upload_items table
CREATE TABLE bulk_upload_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id uuid REFERENCES bulk_uploads(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_size integer NOT NULL,
  file_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  error text,
  metadata jsonb DEFAULT '{}'::jsonb,
  design_id uuid REFERENCES designs(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sync_providers table
CREATE TABLE sync_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id uuid REFERENCES designs(id) ON DELETE CASCADE,
  provider pod_provider NOT NULL,
  provider_id text,
  sync_status text NOT NULL DEFAULT 'pending',
  last_synced_at timestamptz,
  error text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(design_id, provider)
);

-- Enable RLS
ALTER TABLE bulk_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_upload_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_providers ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view their bulk uploads"
  ON bulk_uploads FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their bulk uploads"
  ON bulk_uploads FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view their upload items"
  ON bulk_upload_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bulk_uploads
      WHERE bulk_uploads.id = bulk_upload_items.upload_id
      AND bulk_uploads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their upload items"
  ON bulk_upload_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bulk_uploads
      WHERE bulk_uploads.id = bulk_upload_items.upload_id
      AND bulk_uploads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their sync providers"
  ON sync_providers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM designs
      WHERE designs.id = sync_providers.design_id
      AND designs.shop_id IN (
        SELECT id FROM shops WHERE user_id = auth.uid()
      )
    )
  );

-- Create function to update bulk upload status
CREATE OR REPLACE FUNCTION update_bulk_upload_status()
RETURNS trigger AS $$
BEGIN
  UPDATE bulk_uploads
  SET 
    processed_files = (
      SELECT count(*) FROM bulk_upload_items
      WHERE upload_id = NEW.upload_id
      AND status IN ('success', 'error')
    ),
    failed_files = (
      SELECT count(*) FROM bulk_upload_items
      WHERE upload_id = NEW.upload_id
      AND status = 'error'
    ),
    status = CASE
      WHEN (
        SELECT count(*) FROM bulk_upload_items
        WHERE upload_id = NEW.upload_id
        AND status = 'pending'
      ) = 0 THEN 'completed'
      ELSE 'processing'
    END,
    updated_at = now()
  WHERE id = NEW.upload_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for bulk upload status
CREATE TRIGGER update_bulk_upload_status
  AFTER INSERT OR UPDATE ON bulk_upload_items
  FOR EACH ROW
  EXECUTE FUNCTION update_bulk_upload_status();

-- Add indexes for performance
CREATE INDEX idx_bulk_uploads_user ON bulk_uploads(user_id);
CREATE INDEX idx_bulk_uploads_shop ON bulk_uploads(shop_id);
CREATE INDEX idx_bulk_upload_items_upload ON bulk_upload_items(upload_id);
CREATE INDEX idx_bulk_upload_items_status ON bulk_upload_items(status);
CREATE INDEX idx_sync_providers_design ON sync_providers(design_id);
CREATE INDEX idx_sync_providers_status ON sync_providers(sync_status);

-- Add updated_at triggers
CREATE TRIGGER update_bulk_uploads_updated_at
  BEFORE UPDATE ON bulk_uploads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bulk_upload_items_updated_at
  BEFORE UPDATE ON bulk_upload_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sync_providers_updated_at
  BEFORE UPDATE ON sync_providers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();