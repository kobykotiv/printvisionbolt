/*
  # Add POD Provider Settings

  1. New Tables
    - `provider_settings`
      - `id` (uuid, primary key)
      - `shop_id` (uuid, references shops)
      - `provider` (pod_provider)
      - `api_key` (encrypted text)
      - `store_id` (text)
      - `environment` (text)
      - `settings` (jsonb)
      - `status` (text)
      - `last_synced_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on provider_settings table
    - Add policies for shop owners and admins
    - Encrypt API keys using pgcrypto

  3. Changes
    - Add pgcrypto extension for encryption
    - Add trigger for updated_at
*/

-- Enable pgcrypto for API key encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create provider_settings table
CREATE TABLE provider_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid REFERENCES shops(id) ON DELETE CASCADE,
  provider pod_provider NOT NULL,
  api_key text NOT NULL,
  store_id text,
  environment text NOT NULL DEFAULT 'production',
  settings jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'disconnected',
  last_synced_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(shop_id, provider)
);

-- Enable RLS
ALTER TABLE provider_settings ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view their shop provider settings"
  ON provider_settings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shops
      WHERE shops.id = provider_settings.shop_id
      AND shops.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their shop provider settings"
  ON provider_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shops
      WHERE shops.id = provider_settings.shop_id
      AND shops.user_id = auth.uid()
    )
  );

-- Add function to encrypt API keys
CREATE OR REPLACE FUNCTION encrypt_api_key() 
RETURNS trigger AS $$
BEGIN
  -- Only encrypt if the API key has changed
  IF TG_OP = 'INSERT' OR NEW.api_key <> OLD.api_key THEN
    NEW.api_key = encode(encrypt(
      NEW.api_key::bytea,
      current_setting('app.settings.encryption_key')::bytea,
      'aes'
    ), 'base64');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to encrypt API keys on insert/update
CREATE TRIGGER encrypt_provider_api_key
  BEFORE INSERT OR UPDATE ON provider_settings
  FOR EACH ROW
  EXECUTE FUNCTION encrypt_api_key();

-- Add function to decrypt API keys
CREATE OR REPLACE FUNCTION decrypt_api_key(encrypted_key text)
RETURNS text AS $$
BEGIN
  RETURN convert_from(
    decrypt(
      decode(encrypted_key, 'base64'),
      current_setting('app.settings.encryption_key')::bytea,
      'aes'
    ),
    'utf8'
  );
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger
CREATE TRIGGER update_provider_settings_updated_at
  BEFORE UPDATE ON provider_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes
CREATE INDEX idx_provider_settings_shop ON provider_settings(shop_id);
CREATE INDEX idx_provider_settings_provider ON provider_settings(provider);
CREATE INDEX idx_provider_settings_status ON provider_settings(status);