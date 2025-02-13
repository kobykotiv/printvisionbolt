/*
  # Integrations and Sync Schema
  
  1. Core Tables
    - supplier_integrations (POD connections)
    - sync_logs (sync history)
    - sync_queue (processing queue)
  
  2. Security
    - RLS policies for all tables
    - Shop-based access control
*/

-- Create supplier_integrations table
CREATE TABLE supplier_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops NOT NULL,
  supplier supplier_type NOT NULL,
  api_key text NOT NULL,
  settings jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'disconnected',
  last_sync_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(shop_id, supplier)
);

-- Create sync_logs table
CREATE TABLE sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops NOT NULL,
  integration_id uuid REFERENCES supplier_integrations,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create sync_queue table
CREATE TABLE sync_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops NOT NULL,
  integration_id uuid REFERENCES supplier_integrations,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  priority integer DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  retries integer DEFAULT 0,
  error_message text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE supplier_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies for supplier_integrations
CREATE POLICY "Users can access shop integrations"
  ON supplier_integrations FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.shop_id = supplier_integrations.shop_id
    )
  );

-- RLS Policies for sync_logs
CREATE POLICY "Users can access shop sync logs"
  ON sync_logs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.shop_id = sync_logs.shop_id
    )
  );

-- RLS Policies for sync_queue
CREATE POLICY "Users can access shop sync queue"
  ON sync_queue FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.shop_id = sync_queue.shop_id
    )
  );

-- Add indexes for performance
CREATE INDEX idx_supplier_integrations_shop_id ON supplier_integrations(shop_id);
CREATE INDEX idx_supplier_integrations_supplier ON supplier_integrations(supplier);
CREATE INDEX idx_sync_logs_shop_id ON sync_logs(shop_id);
CREATE INDEX idx_sync_logs_integration_id ON sync_logs(integration_id);
CREATE INDEX idx_sync_logs_entity ON sync_logs(entity_type, entity_id);
CREATE INDEX idx_sync_queue_shop_id ON sync_queue(shop_id);
CREATE INDEX idx_sync_queue_integration_id ON sync_queue(integration_id);
CREATE INDEX idx_sync_queue_status ON sync_queue(status);
CREATE INDEX idx_sync_queue_priority ON sync_queue(priority DESC);

-- Add updated_at triggers
CREATE TRIGGER update_supplier_integrations_updated_at
  BEFORE UPDATE ON supplier_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sync_logs_updated_at
  BEFORE UPDATE ON sync_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sync_queue_updated_at
  BEFORE UPDATE ON sync_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create sync status view
CREATE VIEW v_sync_status AS
SELECT
  si.shop_id,
  si.supplier,
  si.status as integration_status,
  si.last_sync_at,
  count(sl.*) as total_syncs,
  count(CASE WHEN sl.status = 'error' THEN 1 END) as error_count,
  max(sl.created_at) as last_sync_attempt
FROM supplier_integrations si
LEFT JOIN sync_logs sl ON sl.integration_id = si.id
GROUP BY si.id, si.shop_id, si.supplier, si.status, si.last_sync_at;