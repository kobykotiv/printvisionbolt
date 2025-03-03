/*
  # Add Shop Metrics Tables

  1. New Tables
    - `shop_metrics`
      - Daily metrics tracking for shops
      - Stores usage data, sync stats, etc.
    
  2. Changes
    - Add metrics tracking to existing tables
    - Add triggers for automatic metric updates

  3. Security
    - Enable RLS
    - Add policies for shop owners
*/

-- Create shop_metrics table
CREATE TABLE shop_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  designs_count integer DEFAULT 0,
  templates_count integer DEFAULT 0,
  uploads_count integer DEFAULT 0,
  sync_success_count integer DEFAULT 0,
  sync_error_count integer DEFAULT 0,
  storage_used bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(shop_id, date)
);

-- Enable RLS
ALTER TABLE shop_metrics ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view their shop metrics"
  ON shop_metrics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shops
      WHERE shops.id = shop_metrics.shop_id
      AND shops.user_id = auth.uid()
    )
  );

-- Create function to update metrics
CREATE OR REPLACE FUNCTION update_shop_metrics()
RETURNS trigger AS $$
BEGIN
  -- Update or insert metrics for the current day
  INSERT INTO shop_metrics (shop_id, date)
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
    uploads_count = (
      SELECT count(*) FROM designs 
      WHERE shop_id = NEW.shop_id 
      AND created_at::date = CURRENT_DATE
    ),
    sync_success_count = (
      SELECT count(*) FROM sync_logs 
      WHERE shop_id = NEW.shop_id 
      AND status = 'success'
      AND created_at::date = CURRENT_DATE
    ),
    sync_error_count = (
      SELECT count(*) FROM sync_logs 
      WHERE shop_id = NEW.shop_id 
      AND status = 'error'
      AND created_at::date = CURRENT_DATE
    ),
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update metrics
CREATE TRIGGER update_metrics_on_design_change
  AFTER INSERT OR UPDATE OR DELETE ON designs
  FOR EACH ROW
  EXECUTE FUNCTION update_shop_metrics();

CREATE TRIGGER update_metrics_on_template_change
  AFTER INSERT OR UPDATE OR DELETE ON pod_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_shop_metrics();

CREATE TRIGGER update_metrics_on_sync_change
  AFTER INSERT OR UPDATE ON sync_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_shop_metrics();

-- Add indexes for performance
CREATE INDEX idx_shop_metrics_shop_date ON shop_metrics(shop_id, date);
CREATE INDEX idx_shop_metrics_date ON shop_metrics(date);

-- Add updated_at trigger
CREATE TRIGGER update_shop_metrics_updated_at
  BEFORE UPDATE ON shop_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();