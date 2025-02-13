/*
  # Add Sync Logs Table (If Not Exists)
  
  1. New Tables
    - sync_logs: Track synchronization operations and their status (if not already created)
      - id (uuid, primary key)
      - shop_id (uuid, references shops)
      - entity_type (text)
      - entity_id (uuid)
      - status (sync_status)
      - error_message (text)
      - metadata (jsonb)
      - created_at (timestamptz)
      - updated_at (timestamptz)
  
  2. Security
    - Enable RLS on sync_logs table
    - Add policies for viewing, creating, and updating sync logs
  
  3. Performance
    - Add indexes for shop_id, entity lookup, and created_at
*/

DO $$ BEGIN
  -- Create sync_logs table if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'sync_logs') THEN
    CREATE TABLE sync_logs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      shop_id uuid REFERENCES shops NOT NULL,
      entity_type text NOT NULL,
      entity_id uuid NOT NULL,
      status sync_status NOT NULL DEFAULT 'pending',
      error_message text,
      metadata jsonb DEFAULT '{}'::jsonb,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

    -- Add RLS policies
    CREATE POLICY "Users can view sync logs for their shops"
      ON sync_logs FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_roles
          WHERE user_roles.user_id = auth.uid()
          AND user_roles.shop_id = sync_logs.shop_id
        )
      );

    CREATE POLICY "Users can create sync logs for their shops"
      ON sync_logs FOR INSERT
      TO authenticated
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM user_roles
          WHERE user_roles.user_id = auth.uid()
          AND user_roles.shop_id = sync_logs.shop_id
        )
      );

    CREATE POLICY "Users can update sync logs for their shops"
      ON sync_logs FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM user_roles
          WHERE user_roles.user_id = auth.uid()
          AND user_roles.shop_id = sync_logs.shop_id
        )
      );

    -- Add indexes for performance
    CREATE INDEX idx_sync_logs_shop_id ON sync_logs(shop_id);
    CREATE INDEX idx_sync_logs_entity ON sync_logs(entity_type, entity_id);
    CREATE INDEX idx_sync_logs_created_at ON sync_logs(created_at);

    -- Add updated_at trigger
    CREATE TRIGGER update_sync_logs_updated_at
      BEFORE UPDATE ON sync_logs
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;