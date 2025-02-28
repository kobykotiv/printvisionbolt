/*
  # Fix Database Policies and Add Shop Features

  1. Changes
    - Drop and recreate user role policies to avoid conflicts
    - Add shop tier and usage tracking
    - Add proper metrics rollup
    - Add storage limits

  2. Features
    - Shop tier management
    - Usage statistics
    - Limit enforcement
    - Daily upload tracking
*/

-- First drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "Users can view roles for their shops" ON user_roles;
DROP POLICY IF EXISTS "Only admins can manage roles" ON user_roles;
DROP POLICY IF EXISTS "Shop owners can manage roles" ON user_roles;
DROP POLICY IF EXISTS "Users can access shop designs" ON designs;

-- Create new non-recursive policies
CREATE POLICY "View own roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Manage shop roles"
  ON user_roles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shops
      WHERE shops.id = user_roles.shop_id
      AND shops.user_id = auth.uid()
    )
  );

-- Add shop tier and limits tracking
ALTER TABLE shops ADD COLUMN IF NOT EXISTS tier text NOT NULL DEFAULT 'free';
ALTER TABLE shops ADD COLUMN IF NOT EXISTS limits jsonb NOT NULL DEFAULT '{
  "maxDesigns": 100,
  "maxTemplates": 10,
  "maxDailyUploads": 50,
  "maxStorage": 5368709120
}'::jsonb;

-- Create shop_usage table for tracking limits
CREATE TABLE IF NOT EXISTS shop_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  designs_count integer DEFAULT 0,
  templates_count integer DEFAULT 0,
  uploads_today integer DEFAULT 0,
  storage_used bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(shop_id, date)
);

-- Enable RLS on shop_usage
ALTER TABLE shop_usage ENABLE ROW LEVEL SECURITY;

-- Add shop_usage policies
CREATE POLICY "View shop usage"
  ON shop_usage FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shops
      WHERE shops.id = shop_usage.shop_id
      AND shops.user_id = auth.uid()
    )
  );

-- Create function to check shop limits
CREATE OR REPLACE FUNCTION check_shop_limits()
RETURNS trigger AS $$
DECLARE
  shop_limits jsonb;
  current_usage record;
BEGIN
  -- Get shop limits
  SELECT limits INTO shop_limits
  FROM shops
  WHERE id = NEW.shop_id;

  -- Get current usage
  SELECT * INTO current_usage
  FROM shop_usage
  WHERE shop_id = NEW.shop_id
  AND date = CURRENT_DATE;

  -- Check limits
  IF TG_TABLE_NAME = 'designs' THEN
    IF current_usage.designs_count >= (shop_limits->>'maxDesigns')::int THEN
      RAISE EXCEPTION 'Design limit reached for this shop';
    END IF;
    
    IF current_usage.uploads_today >= (shop_limits->>'maxDailyUploads')::int THEN
      RAISE EXCEPTION 'Daily upload limit reached';
    END IF;
  END IF;

  IF TG_TABLE_NAME = 'pod_templates' THEN
    IF current_usage.templates_count >= (shop_limits->>'maxTemplates')::int THEN
      RAISE EXCEPTION 'Template limit reached for this shop';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for limit checking
DROP TRIGGER IF EXISTS check_design_limits ON designs;
CREATE TRIGGER check_design_limits
  BEFORE INSERT ON designs
  FOR EACH ROW
  EXECUTE FUNCTION check_shop_limits();

DROP TRIGGER IF EXISTS check_template_limits ON pod_templates;
CREATE TRIGGER check_template_limits
  BEFORE INSERT ON pod_templates
  FOR EACH ROW
  EXECUTE FUNCTION check_shop_limits();

-- Create function to update usage
CREATE OR REPLACE FUNCTION update_shop_usage()
RETURNS trigger AS $$
BEGIN
  INSERT INTO shop_usage (shop_id, date)
  VALUES (NEW.shop_id, CURRENT_DATE)
  ON CONFLICT (shop_id, date) DO UPDATE
  SET 
    designs_count = (
      SELECT count(*) FROM designs 
      WHERE shop_id = NEW.shop_id
    ),
    templates_count = (
      SELECT count(*) FROM pod_templates 
      WHERE shop_id = NEW.shop_id
    ),
    uploads_today = (
      SELECT count(*) FROM designs 
      WHERE shop_id = NEW.shop_id 
      AND created_at::date = CURRENT_DATE
    ),
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for usage tracking
DROP TRIGGER IF EXISTS update_usage_on_design_change ON designs;
CREATE TRIGGER update_usage_on_design_change
  AFTER INSERT OR DELETE ON designs
  FOR EACH ROW
  EXECUTE FUNCTION update_shop_usage();

DROP TRIGGER IF EXISTS update_usage_on_template_change ON pod_templates;
CREATE TRIGGER update_usage_on_template_change
  AFTER INSERT OR DELETE ON pod_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_shop_usage();

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_shop_usage_date ON shop_usage(date);
CREATE INDEX IF NOT EXISTS idx_shop_usage_shop_date ON shop_usage(shop_id, date);

-- Update existing shops with default tier and limits
UPDATE shops SET 
  tier = 'free',
  limits = '{
    "maxDesigns": 100,
    "maxTemplates": 10,
    "maxDailyUploads": 50,
    "maxStorage": 5368709120
  }'::jsonb
WHERE tier IS NULL;