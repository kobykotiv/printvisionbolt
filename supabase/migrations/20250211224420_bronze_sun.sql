/*
  # Add multi-tenant support and role-based access control

  1. New Tables
    - `shops`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `settings` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `user_roles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `role` (enum: admin, manager, designer)
      - `shop_id` (uuid, references shops)
      - `created_at` (timestamp)

  2. Changes
    - Add `shop_id` to existing tables
    - Update RLS policies

  3. Security
    - Enable RLS on new tables
    - Add policies for role-based access
*/

-- Create shops table
CREATE TABLE IF NOT EXISTS shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create role enum
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'designer');

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  role user_role NOT NULL,
  shop_id uuid REFERENCES shops NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, shop_id)
);

-- Add shop_id to existing tables
ALTER TABLE designs ADD COLUMN shop_id uuid REFERENCES shops;
ALTER TABLE products ADD COLUMN shop_id uuid REFERENCES shops;
ALTER TABLE collections ADD COLUMN shop_id uuid REFERENCES shops;
ALTER TABLE supplier_integrations ADD COLUMN shop_id uuid REFERENCES shops;

-- Enable RLS
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

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

-- Update existing RLS policies to include shop_id checks
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
CREATE INDEX idx_shops_user_id ON shops(user_id);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_shop_id ON user_roles(shop_id);
CREATE INDEX idx_designs_shop_id ON designs(shop_id);
CREATE INDEX idx_products_shop_id ON products(shop_id);
CREATE INDEX idx_collections_shop_id ON collections(shop_id);
CREATE INDEX idx_supplier_integrations_shop_id ON supplier_integrations(shop_id);