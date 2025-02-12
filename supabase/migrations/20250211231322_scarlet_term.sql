/*
  # Print-on-Demand Collection System Schema

  1. New Tables
    - `pod_templates`
      - Core template information
      - Provider-specific metadata
      - Version control
    
    - `pod_blueprints`
      - Product specifications
      - Print area configurations
      - Variant definitions
    
    - `pod_placeholders`
      - Design placement information
      - Position and transformation data
      - Print requirements

  2. Changes
    - Added provider-specific configuration tables
    - Enhanced collection-template relationships
    
  3. Security
    - Enabled RLS on all new tables
    - Added policies for authenticated access
*/

-- Create provider enum if not exists
DO $$ BEGIN
  CREATE TYPE pod_provider AS ENUM ('printify', 'printful', 'gooten', 'gelato', 'prodigi');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create measurement unit enum
DO $$ BEGIN
  CREATE TYPE measurement_unit AS ENUM ('mm', 'cm', 'in');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create file format enum
DO $$ BEGIN
  CREATE TYPE file_format AS ENUM ('png', 'jpg', 'svg', 'pdf', 'ai', 'eps');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Templates table
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

-- Blueprints table
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

-- Placeholders table
CREATE TABLE IF NOT EXISTS pod_placeholders (
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

-- Collection Templates junction table
CREATE TABLE IF NOT EXISTS collection_templates (
  collection_id uuid REFERENCES collections NOT NULL,
  template_id uuid REFERENCES pod_templates NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (collection_id, template_id)
);

-- Template version history
CREATE TABLE IF NOT EXISTS pod_template_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES pod_templates NOT NULL,
  version integer NOT NULL,
  changes jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users NOT NULL,
  UNIQUE(template_id, version)
);

-- Enable RLS
ALTER TABLE pod_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pod_blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE pod_placeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pod_template_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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

-- Similar policies for other tables...

-- Add indexes for performance
CREATE INDEX idx_pod_templates_shop_provider ON pod_templates(shop_id, provider);
CREATE INDEX idx_pod_blueprints_template ON pod_blueprints(template_id);
CREATE INDEX idx_pod_placeholders_blueprint ON pod_placeholders(blueprint_id);
CREATE INDEX idx_pod_placeholders_design ON pod_placeholders(design_id);
CREATE INDEX idx_collection_templates_collection ON collection_templates(collection_id);
CREATE INDEX idx_pod_template_versions_template ON pod_template_versions(template_id, version);

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pod_templates_updated_at
  BEFORE UPDATE ON pod_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pod_blueprints_updated_at
  BEFORE UPDATE ON pod_blueprints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
