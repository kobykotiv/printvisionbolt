/*
  # Initial Schema Setup for PrintVision.Cloud

  1. New Tables
    - `designs` - Stores design files and metadata
    - `products` - Product information and variants
    - `collections` - Groups of products/designs
    - `templates` - Product templates/recipes
    - `scheduled_drops` - Scheduled product releases
    - `supplier_integrations` - Print service API configurations

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create custom types
CREATE TYPE product_status AS ENUM ('draft', 'active', 'archived');
CREATE TYPE supplier_type AS ENUM ('printify', 'printful', 'gooten', 'gelato');

-- Designs table
CREATE TABLE IF NOT EXISTS designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  thumbnail_url text,
  tags text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  variants jsonb[],
  placeholders jsonb[],
  rules jsonb[],
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id uuid REFERENCES designs NOT NULL,
  template_id uuid REFERENCES templates NOT NULL,
  title text NOT NULL,
  description text,
  sku text UNIQUE,
  status product_status NOT NULL DEFAULT 'draft',
  pricing jsonb NOT NULL,
  variants jsonb[],
  supplier_data jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Collections table
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  products uuid[] REFERENCES products(id),
  scheduled_drops jsonb[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Scheduled drops table
CREATE TABLE IF NOT EXISTS scheduled_drops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid REFERENCES collections,
  product_id uuid REFERENCES products,
  scheduled_for timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'scheduled',
  options jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT one_target_only CHECK (
    (collection_id IS NOT NULL AND product_id IS NULL) OR
    (collection_id IS NULL AND product_id IS NOT NULL)
  )
);

-- Supplier integrations table
CREATE TABLE IF NOT EXISTS supplier_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  supplier supplier_type NOT NULL,
  api_key text NOT NULL,
  webhook_url text,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, supplier)
);

-- Enable RLS
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_drops ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_integrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own designs"
  ON designs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own designs"
  ON designs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own designs"
  ON designs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own designs"
  ON designs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Similar policies for other tables...
CREATE POLICY "Users can read own supplier integrations"
  ON supplier_integrations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own supplier integrations"
  ON supplier_integrations FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX idx_designs_user_id ON designs(user_id);
CREATE INDEX idx_products_design_id ON products(design_id);
CREATE INDEX idx_products_template_id ON products(template_id);
CREATE INDEX idx_scheduled_drops_scheduled_for ON scheduled_drops(scheduled_for);
CREATE INDEX idx_supplier_integrations_user_supplier ON supplier_integrations(user_id, supplier);
