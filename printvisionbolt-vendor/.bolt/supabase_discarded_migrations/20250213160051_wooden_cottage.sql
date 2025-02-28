-- Create custom types if they don't exist
DO $$ BEGIN
  CREATE TYPE product_status AS ENUM ('draft', 'active', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE pod_provider AS ENUM ('printify', 'printful', 'gooten', 'gelato');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'manager', 'designer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE sync_status AS ENUM ('success', 'error', 'pending');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE measurement_unit AS ENUM ('mm', 'cm', 'in');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE file_format AS ENUM ('png', 'jpg', 'svg', 'pdf', 'ai', 'eps');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create shops table first as it's referenced by other tables
CREATE TABLE IF NOT EXISTS shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  role user_role NOT NULL,
  shop_id uuid REFERENCES shops NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, shop_id)
);

-- Create designs table
CREATE TABLE IF NOT EXISTS designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops NOT NULL,
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  thumbnail_url text,
  tags text[],
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops NOT NULL,
  name text NOT NULL,
  description text,
  scheduled_drops jsonb[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pod_templates table
CREATE TABLE IF NOT EXISTS pod_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops NOT NULL,
  provider pod_provider NOT NULL,
  provider_template_id text NOT NULL,
  name text NOT NULL,
  description text,
  version integer NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(shop_id, provider, provider_template_id)
);

-- Create pod_blueprints table
CREATE TABLE IF NOT EXISTS pod_blueprints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES pod_templates NOT NULL,
  product_type text NOT NULL,
  description text,
  base_cost numeric(10,2) NOT NULL,
  retail_price numeric(10,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  print_areas jsonb[] NOT NULL,
  variants jsonb[] NOT NULL,
  size_chart jsonb,
  color_options jsonb[],
  inventory_status jsonb DEFAULT '{}'::jsonb,
  print_requirements jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pod_placeholders table
CREATE TABLE IF NOT EXISTS pod_placeholders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id uuid REFERENCES pod_blueprints NOT NULL,
  name text NOT NULL,
  position_x float NOT NULL,
  position_y float NOT NULL,
  width float NOT NULL,
  height float NOT NULL,
  rotation_angle integer NOT NULL DEFAULT 0,
  scale_factor integer NOT NULL DEFAULT 100,
  measurement_unit measurement_unit NOT NULL DEFAULT 'mm',
  required_formats file_format[] NOT NULL,
  min_dpi integer NOT NULL,
  recommended_dpi integer NOT NULL,
  print_area_boundaries jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_position CHECK (
    position_x >= 0 AND
    position_y >= 0 AND
    width > 0 AND
    height > 0 AND
    scale_factor > 0 AND
    scale_factor <= 400
  )
);

-- Create sync_logs table
CREATE TABLE IF NOT EXISTS sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops NOT NULL,
  design_id uuid REFERENCES designs NOT NULL,
  provider pod_provider NOT NULL,
  status sync_status NOT NULL DEFAULT 'pending',
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  settings jsonb NOT NULL DEFAULT '{
    "autoSave": true,
    "theme": "system",
    "previewMode": "live",
    "gridSize": 12,
    "notifications": {
      "email": true,
      "push": true,
      "desktop": true
    },
    "recent": {
      "templates": [],
      "designs": [],
      "blueprints": []
    },
    "favorites": {
      "templates": [],
      "designs": [],
      "blueprints": []
    }
  }',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on all tables
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE pod_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pod_blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE pod_placeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shops
CREATE POLICY "Users can view their own shops"
  ON shops FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own shops"
  ON shops FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view roles for their shops"
  ON user_roles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shops
      WHERE shops.id = user_roles.shop_id
      AND shops.user_id = auth.uid()
    )
  );

-- RLS Policies for designs
CREATE POLICY "Users can view designs for their shops"
  ON designs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shops
      WHERE shops.id = designs.shop_id
      AND shops.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage designs for their shops"
  ON designs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shops
      WHERE shops.id = designs.shop_id
      AND shops.user_id = auth.uid()
    )
  );

-- RLS Policies for collections
CREATE POLICY "Users can view collections for their shops"
  ON collections FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shops
      WHERE shops.id = collections.shop_id
      AND shops.user_id = auth.uid()
    )
  );

-- RLS Policies for pod_templates
CREATE POLICY "Users can view templates for their shops"
  ON pod_templates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shops
      WHERE shops.id = pod_templates.shop_id
      AND shops.user_id = auth.uid()
    )
  );

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_shops_user_id ON shops(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_shop_id ON user_roles(shop_id);
CREATE INDEX IF NOT EXISTS idx_designs_shop_id ON designs(shop_id);
CREATE INDEX IF NOT EXISTS idx_collections_shop_id ON collections(shop_id);
CREATE INDEX IF NOT EXISTS idx_pod_templates_shop_provider ON pod_templates(shop_id, provider);
CREATE INDEX IF NOT EXISTS idx_pod_blueprints_template ON pod_blueprints(template_id);
CREATE INDEX IF NOT EXISTS idx_pod_placeholders_blueprint ON pod_placeholders(blueprint_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_shop_id ON sync_logs(shop_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_shops_updated_at ON shops;
CREATE TRIGGER update_shops_updated_at
  BEFORE UPDATE ON shops
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_designs_updated_at ON designs;
CREATE TRIGGER update_designs_updated_at
  BEFORE UPDATE ON designs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_collections_updated_at ON collections;
CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pod_templates_updated_at ON pod_templates;
CREATE TRIGGER update_pod_templates_updated_at
  BEFORE UPDATE ON pod_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pod_blueprints_updated_at ON pod_blueprints;
CREATE TRIGGER update_pod_blueprints_updated_at
  BEFORE UPDATE ON pod_blueprints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pod_placeholders_updated_at ON pod_placeholders;
CREATE TRIGGER update_pod_placeholders_updated_at
  BEFORE UPDATE ON pod_placeholders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();