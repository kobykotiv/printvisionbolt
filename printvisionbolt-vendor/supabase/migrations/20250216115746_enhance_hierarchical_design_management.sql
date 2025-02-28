-- Enhance Collections table
ALTER TABLE collections 
  ADD COLUMN sort_order INTEGER DEFAULT 0,
  ADD COLUMN visibility TEXT DEFAULT 'private',
  ADD COLUMN tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN custom_fields JSONB DEFAULT '{}'::JSONB;

-- Update Collections metadata structure
ALTER TABLE collections 
  DROP COLUMN metadata,
  ADD COLUMN metadata JSONB DEFAULT jsonb_build_object(
    'createdAt', CURRENT_TIMESTAMP,
    'updatedAt', CURRENT_TIMESTAMP,
    'createdBy', NULL,
    'lastModifiedBy', NULL,
    'version', 1,
    'archivedAt', NULL,
    'restoredAt', NULL,
    'accessCount', 0,
    'lastAccessedAt', CURRENT_TIMESTAMP
  );

-- Update Collections permissions structure
ALTER TABLE collections 
  DROP COLUMN permissions,
  ADD COLUMN permissions JSONB DEFAULT jsonb_build_object(
    'read', ARRAY[]::TEXT[],
    'write', ARRAY[]::TEXT[],
    'admin', ARRAY[]::TEXT[],
    'share', ARRAY[]::TEXT[],
    'delete', ARRAY[]::TEXT[],
    'managePermissions', ARRAY[]::TEXT[]
  );

-- Enhance Designs table version history
ALTER TABLE designs
  DROP COLUMN version_history,
  ADD COLUMN version_history JSONB[] DEFAULT ARRAY[]::JSONB[];

-- Add collection memberships to Designs
ALTER TABLE designs
  ADD COLUMN collection_memberships JSONB[] DEFAULT ARRAY[]::JSONB[];

-- Create optimized indexes
CREATE INDEX IF NOT EXISTS idx_collection_path ON collections USING GIN (path);
CREATE INDEX IF NOT EXISTS idx_collection_parent ON collections (parent_id);
CREATE INDEX IF NOT EXISTS idx_collection_level ON collections (level);
CREATE INDEX IF NOT EXISTS idx_collection_visibility ON collections (visibility);
CREATE INDEX IF NOT EXISTS idx_design_collections ON designs USING GIN (collection_memberships);
CREATE INDEX IF NOT EXISTS idx_design_version ON designs (version);

-- Update collection path trigger function
CREATE OR REPLACE FUNCTION update_collection_path()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_id IS NULL THEN
    NEW.path := ARRAY[NEW.id];
    NEW.level := 1;
  ELSE
    SELECT path || NEW.id, array_length(path, 1) + 1
    INTO NEW.path, NEW.level
    FROM collections
    WHERE id = NEW.parent_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update version history trigger function for designs
CREATE OR REPLACE FUNCTION log_design_version()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.version > OLD.version) THEN
    NEW.version_history := array_append(
      OLD.version_history,
      jsonb_build_object(
        'version', NEW.version,
        'timestamp', CURRENT_TIMESTAMP,
        'userId', current_setting('app.current_user_id', TRUE),
        'changes', '',
        'metadata', NEW.metadata,
        'previousVersion', OLD.version
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for version history
DROP TRIGGER IF EXISTS design_version_trigger ON designs;
CREATE TRIGGER design_version_trigger
  BEFORE UPDATE ON designs
  FOR EACH ROW
  WHEN (NEW.version > OLD.version)
  EXECUTE FUNCTION log_design_version();

-- Create function to check circular dependencies
CREATE OR REPLACE FUNCTION check_circular_dependency(collection_id TEXT, new_parent_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  current_id TEXT;
BEGIN
  IF new_parent_id IS NULL THEN
    RETURN TRUE;
  END IF;

  current_id := new_parent_id;
  WHILE current_id IS NOT NULL LOOP
    IF current_id = collection_id THEN
      RETURN FALSE;
    END IF;
    SELECT parent_id INTO current_id
    FROM collections
    WHERE id = current_id;
  END LOOP;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to prevent circular dependencies
CREATE OR REPLACE FUNCTION prevent_circular_dependency()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT check_circular_dependency(NEW.id, NEW.parent_id) THEN
    RAISE EXCEPTION 'Circular dependency detected in collection hierarchy';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS collection_circular_check ON collections;
CREATE TRIGGER collection_circular_check
  BEFORE INSERT OR UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION prevent_circular_dependency();

-- Add function to inherit permissions
CREATE OR REPLACE FUNCTION inherit_collection_permissions()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_id IS NOT NULL THEN
    SELECT permissions INTO NEW.permissions
    FROM collections
    WHERE id = NEW.parent_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for permission inheritance
DROP TRIGGER IF EXISTS collection_permission_inheritance ON collections;
CREATE TRIGGER collection_permission_inheritance
  BEFORE INSERT ON collections
  FOR EACH ROW
  WHEN (NEW.permissions IS NULL)
  EXECUTE FUNCTION inherit_collection_permissions();

-- Add cascade options for collection deletion
ALTER TABLE collections
  DROP CONSTRAINT IF EXISTS collections_parent_id_fkey,
  ADD CONSTRAINT collections_parent_id_fkey
    FOREIGN KEY (parent_id)
    REFERENCES collections(id)
    ON DELETE CASCADE;