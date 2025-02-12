/*
  # Add sync logs table

  1. New Tables
    - `sync_logs`
      - `id` (uuid, primary key)
      - `shop_id` (uuid, references shops)
      - `design_id` (uuid, references designs)
      - `supplier` (enum: printify, printful, gooten)
      - `status` (enum: success, error, pending)
      - `error_message` (text, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create supplier type if not exists
DO $$ BEGIN
  CREATE TYPE sync_supplier AS ENUM ('printify', 'printful', 'gooten');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create status type if not exists
DO $$ BEGIN
  CREATE TYPE sync_status AS ENUM ('success', 'error', 'pending');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create sync_logs table
CREATE TABLE IF NOT EXISTS sync_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops NOT NULL,
  design_id uuid REFERENCES designs NOT NULL,
  supplier sync_supplier NOT NULL,
  status sync_status NOT NULL DEFAULT 'pending',
  error_message text,
  created_at timestamptz DEFAULT now()
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
CREATE INDEX idx_sync_logs_design_id ON sync_logs(design_id);
CREATE INDEX idx_sync_logs_created_at ON sync_logs(created_at);
