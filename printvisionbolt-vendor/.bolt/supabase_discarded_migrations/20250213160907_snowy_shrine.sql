/*
  # Shop-Centric Schema Migration

  1. Core Tables
    - shops (main entity for multi-tenant support)
    - user_roles (role management per shop)
    - designs (shop-specific designs)
    
  2. Security
    - RLS policies for all tables
    - Shop-based access control
    
  3. Performance
    - Indexes on foreign keys and frequently queried columns
    - Updated_at triggers for change tracking
*/

-- Create updated_at trigger function if not exists
DO $$ BEGIN
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
  $$ language 'plpgsql';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create shops table
CREATE TABLE IF NOT EXISTS shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_roles table using existing user_role type
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'manager', 'designer')),
  shop_id uuid REFERENCES shops NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, shop_id)
);

-- Create designs table using existing product_status type
CREATE TABLE IF NOT EXISTS designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops NOT NULL,
  name text NOT NULL,
  description text,
  file_url text NOT NULL,
  thumbnail_url text,
  category text,
  tags text[],
  status text NOT NULL CHECK (status IN ('draft', 'active', 'archived')) DEFAULT 'draft',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;

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

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_shops_user_id ON shops(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_shop_id ON user_roles(shop_id);
CREATE INDEX IF NOT EXISTS idx_designs_shop_id ON designs(shop_id);

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