/*
  Remove Prodigi Support

  1. Back up existing Prodigi integrations
  2. Remove Prodigi from supplier_type enum
  3. Update affected database constraints
*/

-- Create backup table for Prodigi integrations
CREATE TABLE IF NOT EXISTS supplier_integrations_prodigi_backup AS
SELECT * FROM supplier_integrations WHERE supplier = 'prodigi';

-- Create new enum without Prodigi
CREATE TYPE supplier_type_new AS ENUM ('printify', 'printful', 'gooten', 'gelato');

-- Update existing supplier integrations to use new type
ALTER TABLE supplier_integrations ALTER COLUMN supplier TYPE supplier_type_new 
USING CASE 
  WHEN supplier::text = 'prodigi' THEN 'printify'::supplier_type_new 
  ELSE supplier::text::supplier_type_new 
END;

-- Drop old enum
DROP TYPE supplier_type;

-- Rename new enum to original name
ALTER TYPE supplier_type_new RENAME TO supplier_type;

-- Add a note in metadata for migrated Prodigi integrations
UPDATE supplier_integrations 
SET settings = settings || 
  jsonb_build_object(
    'migrated_from_prodigi', true,
    'migrated_at', now()
  )
WHERE id IN (
  SELECT id FROM supplier_integrations_prodigi_backup
);

-- Create view for easy access to backup data
CREATE VIEW v_prodigi_backup AS
SELECT * FROM supplier_integrations_prodigi_backup;

-- Add comment explaining the backup
COMMENT ON TABLE supplier_integrations_prodigi_backup IS 
'Backup of Prodigi integrations before removal. Data preserved for historical reference.';