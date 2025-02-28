/*
  # Collections and Scheduled Drops Schema
  
  1. Core Tables
    - collections (product groupings)
    - collection_products (product assignments)
    - scheduled_drops (timed releases)
  
  2. Security
    - RLS policies for all tables
    - Shop-based access control
*/

-- Create collections table
CREATE TABLE collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops NOT NULL,
  title text NOT NULL,
  description text,
  status product_status DEFAULT 'draft',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create collection_products junction table
CREATE TABLE collection_products (
  collection_id uuid REFERENCES collections ON DELETE CASCADE,
  product_id uuid REFERENCES products ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (collection_id, product_id)
);

-- Create scheduled_drops table
CREATE TABLE scheduled_drops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops NOT NULL,
  collection_id uuid REFERENCES collections,
  scheduled_for timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'scheduled',
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_drops ENABLE ROW LEVEL SECURITY;

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

-- RLS Policies for collection_products
CREATE POLICY "Users can access collection products"
  ON collection_products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM collections c
      JOIN user_roles ur ON ur.shop_id = c.shop_id
      WHERE c.id = collection_products.collection_id
      AND ur.user_id = auth.uid()
    )
  );

-- RLS Policies for scheduled_drops
CREATE POLICY "Users can access shop drops"
  ON scheduled_drops FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.shop_id = scheduled_drops.shop_id
    )
  );

-- Add indexes for performance
CREATE INDEX idx_collections_shop_id ON collections(shop_id);
CREATE INDEX idx_collections_status ON collections(status);
CREATE INDEX idx_collection_products_collection_id ON collection_products(collection_id);
CREATE INDEX idx_collection_products_product_id ON collection_products(product_id);
CREATE INDEX idx_scheduled_drops_shop_id ON scheduled_drops(shop_id);
CREATE INDEX idx_scheduled_drops_collection_id ON scheduled_drops(collection_id);
CREATE INDEX idx_scheduled_drops_scheduled_for ON scheduled_drops(scheduled_for);

-- Add updated_at triggers
CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_drops_updated_at
  BEFORE UPDATE ON scheduled_drops
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();