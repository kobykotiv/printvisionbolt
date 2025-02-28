/*
  # Complete Database Schema
  
  1. Core Types & Functions
    - Enums for status, roles, providers
    - Updated timestamp trigger
  
  2. Base Tables
    - shops (organization unit)
    - user_roles (RBAC)
    - designs (design assets)
    - templates (product templates)
    - collections (product groupings)
  
  3. POD Integration
    - pod_templates
    - pod_blueprints
    - pod_placeholders
  
  4. Monitoring
    - sync_logs
    - user_settings
*/

-- Create custom types
CREATE TYPE product_status AS ENUM ('draft', 'active', 'archived');
CREATE TYPE pod_provider AS ENUM ('printify', 'printful', 'gooten', 'gelato');
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'designer');
CREATE TYPE sync_status AS ENUM ('success', 'error', 'pending');
CREATE TYPE measurement_unit AS ENUM ('mm', 'cm', 'in');
CREATE TYPE file_format AS ENUM ('png', 'jpg', 'svg', 'pdf', 'ai', 'eps');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create shops table
CREATE TABLE shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_roles table
CREATE TABLE user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  role user_role NOT NULL,
  shop_id uuid REFERENCES shops NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, shop_id)
);

-- Create designs table
CREATE TABLE designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops NOT NULL,
  name text NOT NULL,
  description text,
  file_url text NOT NULL,
  thumbnail_url text,
  category text,
  tags text[],
  status product_status DEFAULT 'draft',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create collections table
CREATE TABLE collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops NOT NULL,
  name text NOT NULL,
  description text,
  thumbnail_url text,
  status product_status DEFAULT 'draft',
  scheduled_drops jsonb[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pod_templates table
CREATE TABLE pod_templates (
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
CREATE TABLE pod_blueprints (
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
CREATE TABLE pod_placeholders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id uuid REFERENCES pod_blueprints NOT NULL,
  design_id uuid REFERENCES designs,
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
CREATE TABLE sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  status sync_status NOT NULL DEFAULT 'pending',
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_settings table
CREATE TABLE user_settings (
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

CREATE POLICY "Users can create their own shops"
  ON shops FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shops"
  ON shops FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

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

CREATE POLICY "Only admins can manage roles"
  ON user_roles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.shop_id = user_roles.shop_id
      AND ur.role = 'admin'
    )
  );

-- RLS Policies for designs
CREATE POLICY "Users can access shop designs"
  ON designs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.shop_id = designs.shop_id
    )
  );

-- RLS Policies for collections
CREATE POLICY "Users can access shop collections"
  ON collections FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.shop_id = collections.shop_id
    )
  );

-- RLS Policies for pod_templates
CREATE POLICY "Users can view templates for their shops"
  ON pod_templates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.shop_id = pod_templates.shop_id
    )
  );

CREATE POLICY "Users can manage templates for their shops"
  ON pod_templates FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.shop_id = pod_templates.shop_id
      AND user_roles.role IN ('admin', 'manager')
    )
  );

-- RLS Policies for sync_logs
CREATE POLICY "Users can view sync logs for their shops"
  ON sync_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.shop_id = sync_logs.shop_id
    )
  );

-- RLS Policies for user_settings
CREATE POLICY "Users can manage their own settings"
  ON user_settings FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX idx_shops_user_id ON shops(user_id);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_shop_id ON user_roles(shop_id);
CREATE INDEX idx_designs_shop_id ON designs(shop_id);
CREATE INDEX idx_collections_shop_id ON collections(shop_id);
CREATE INDEX idx_pod_templates_shop_provider ON pod_templates(shop_id, provider);
CREATE INDEX idx_pod_blueprints_template ON pod_blueprints(template_id);
CREATE INDEX idx_pod_placeholders_blueprint ON pod_placeholders(blueprint_id);
CREATE INDEX idx_pod_placeholders_design ON pod_placeholders(design_id);
CREATE INDEX idx_sync_logs_shop_id ON sync_logs(shop_id);
CREATE INDEX idx_sync_logs_entity ON sync_logs(entity_type, entity_id);
CREATE INDEX idx_sync_logs_created_at ON sync_logs(created_at);

-- Add updated_at triggers
CREATE TRIGGER update_shops_updated_at
  BEFORE UPDATE ON shops
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_designs_updated_at
  BEFORE UPDATE ON designs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pod_templates_updated_at
  BEFORE UPDATE ON pod_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pod_blueprints_updated_at
  BEFORE UPDATE ON pod_blueprints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pod_placeholders_updated_at
  BEFORE UPDATE ON pod_placeholders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sync_logs_updated_at
  BEFORE UPDATE ON sync_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();