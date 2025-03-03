/*
  # Assets and Designs Schema
  
  1. Core Tables
    - designs (design assets)
    - design_versions (version history)
    - design_metadata (extended properties)
  
  2. Security
    - RLS policies for all tables
    - Shop-based access control
*/

-- Create designs table
CREATE TABLE designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops NOT NULL,
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  thumbnail_url text,
  tags text[],
  status product_status DEFAULT 'draft',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create design versions table
CREATE TABLE design_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id uuid REFERENCES designs ON DELETE CASCADE,
  version integer NOT NULL,
  file_url text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users NOT NULL,
  UNIQUE(design_id, version)
);

-- Enable RLS
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_versions ENABLE ROW LEVEL SECURITY;

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

-- RLS Policies for design versions
CREATE POLICY "Users can access design versions"
  ON design_versions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM designs d
      JOIN user_roles ur ON ur.shop_id = d.shop_id
      WHERE d.id = design_versions.design_id
      AND ur.user_id = auth.uid()
    )
  );

-- Add indexes for performance
CREATE INDEX idx_designs_shop_id ON designs(shop_id);
CREATE INDEX idx_designs_status ON designs(status);
CREATE INDEX idx_design_versions_design_id ON design_versions(design_id, version);

-- Add updated_at trigger
CREATE TRIGGER update_designs_updated_at
  BEFORE UPDATE ON designs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();