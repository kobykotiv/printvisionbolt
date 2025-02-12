/*
  Template Relationships and Queue System

  1. Add template-design relationships
  2. Create queue system tables
  3. Add monitoring views
  4. Update existing tables with new fields
*/

-- Template-Design relationships
CREATE TABLE template_designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES templates(id) ON DELETE CASCADE,
  design_id uuid REFERENCES designs(id) ON DELETE CASCADE,
  blueprint_id uuid REFERENCES blueprints(id) ON DELETE CASCADE,
  mappings jsonb DEFAULT '[]',
  status text NOT NULL DEFAULT 'pending',
  error text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(template_id, design_id, blueprint_id)
);

-- Processing queue
CREATE TABLE queue_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('design_upload', 'supplier_sync', 'template_process')),
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  progress integer DEFAULT 0,
  error text,
  metadata jsonb DEFAULT '{}',
  priority integer DEFAULT 0,
  retry_count integer DEFAULT 0,
  max_retries integer DEFAULT 3,
  next_retry_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Template sync status
CREATE TABLE template_sync_status (
  template_id uuid PRIMARY KEY REFERENCES templates(id) ON DELETE CASCADE,
  last_sync_at timestamptz,
  next_sync_at timestamptz,
  status text NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'syncing', 'error')),
  error text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_template_designs_template_id ON template_designs(template_id);
CREATE INDEX idx_template_designs_design_id ON template_designs(design_id);
CREATE INDEX idx_template_designs_status ON template_designs(status);
CREATE INDEX idx_queue_items_status ON queue_items(status);
CREATE INDEX idx_queue_items_type ON queue_items(type);
CREATE INDEX idx_queue_items_priority ON queue_items(priority DESC);
CREATE INDEX idx_template_sync_status_next_sync ON template_sync_status(next_sync_at);

-- Create monitoring views
CREATE VIEW v_queue_stats AS
SELECT
  type,
  status,
  count(*) as count,
  avg(CASE WHEN status = 'completed' THEN 
    EXTRACT(EPOCH FROM (updated_at - created_at))
  END) as avg_processing_time_seconds
FROM queue_items
GROUP BY type, status;

CREATE VIEW v_template_sync_stats AS
SELECT
  t.id as template_id,
  t.title as template_name,
  ts.status as sync_status,
  ts.last_sync_at,
  ts.next_sync_at,
  COUNT(td.id) as design_count,
  SUM(CASE WHEN td.status = 'error' THEN 1 ELSE 0 END) as error_count
FROM templates t
LEFT JOIN template_sync_status ts ON t.id = ts.template_id
LEFT JOIN template_designs td ON t.id = td.template_id
GROUP BY t.id, t.title, ts.status, ts.last_sync_at, ts.next_sync_at;

-- Add RLS policies
ALTER TABLE template_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_sync_status ENABLE ROW LEVEL SECURITY;

-- Template designs policies
CREATE POLICY "Users can view own template designs"
  ON template_designs FOR SELECT
  USING (
    template_id IN (
      SELECT id FROM templates WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own template designs"
  ON template_designs FOR ALL
  USING (
    template_id IN (
      SELECT id FROM templates WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    template_id IN (
      SELECT id FROM templates WHERE user_id = auth.uid()
    )
  );

-- Queue items policies
CREATE POLICY "Users can view own queue items"
  ON queue_items FOR SELECT
  USING (
    metadata->>'user_id' = auth.uid()::text
  );

-- Template sync status policies
CREATE POLICY "Users can view own template sync status"
  ON template_sync_status FOR SELECT
  USING (
    template_id IN (
      SELECT id FROM templates WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own template sync status"
  ON template_sync_status FOR ALL
  USING (
    template_id IN (
      SELECT id FROM templates WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    template_id IN (
      SELECT id FROM templates WHERE user_id = auth.uid()
    )
  );

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_template_designs_updated_at
  BEFORE UPDATE ON template_designs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_queue_items_updated_at
  BEFORE UPDATE ON queue_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_template_sync_status_updated_at
  BEFORE UPDATE ON template_sync_status
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE template_designs IS 'Manages relationships between templates, designs, and blueprints';
COMMENT ON TABLE queue_items IS 'Tracks asynchronous processing tasks';
COMMENT ON TABLE template_sync_status IS 'Tracks template synchronization status with providers';
COMMENT ON VIEW v_queue_stats IS 'Provides statistics about the processing queue';
COMMENT ON VIEW v_template_sync_stats IS 'Provides template synchronization statistics and status';