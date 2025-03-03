/*
  # Fix policies and encryption configuration

  1. Changes
    - Drop problematic recursive policies
    - Create new non-recursive policies for user roles
    - Add encryption key configuration
    - Fix provider settings encryption
    - Update storage configuration

  2. Security
    - Enable RLS on all tables
    - Add proper access policies
    - Secure API key encryption
*/

-- First drop all problematic policies
DROP POLICY IF EXISTS "Users can view roles for their shops" ON user_roles;
DROP POLICY IF EXISTS "Only admins can manage roles" ON user_roles;
DROP POLICY IF EXISTS "Users can access shop designs" ON designs;
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "View own roles" ON user_roles;
DROP POLICY IF EXISTS "Manage shop roles" ON user_roles;

-- Create new non-recursive policies for user roles
CREATE POLICY "role_access"
  ON user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "role_management"
  ON user_roles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shops
      WHERE shops.id = user_roles.shop_id
      AND shops.user_id = auth.uid()
    )
  );

-- Create secure settings table
CREATE TABLE IF NOT EXISTS secure_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on secure settings
ALTER TABLE secure_settings ENABLE ROW LEVEL SECURITY;

-- Add encryption key if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM secure_settings WHERE key = 'encryption_key'
  ) THEN
    INSERT INTO secure_settings (key, value)
    VALUES ('encryption_key', encode(gen_random_bytes(32), 'hex'));
  END IF;
END $$;

-- Create function to get encryption key securely
CREATE OR REPLACE FUNCTION get_encryption_key()
RETURNS text AS $$
BEGIN
  RETURN (SELECT value FROM secure_settings WHERE key = 'encryption_key');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate provider settings encryption function
CREATE OR REPLACE FUNCTION encrypt_api_key() 
RETURNS trigger AS $$
DECLARE
  encryption_key text;
BEGIN
  -- Get encryption key
  encryption_key := get_encryption_key();
  
  -- Only encrypt if the API key has changed
  IF TG_OP = 'INSERT' OR NEW.api_key <> OLD.api_key THEN
    NEW.api_key = encode(
      encrypt(
        convert_to(NEW.api_key, 'utf8'),
        decode(encryption_key, 'hex'),
        'aes'
      ),
      'base64'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate provider settings decryption function
CREATE OR REPLACE FUNCTION decrypt_api_key(encrypted_key text)
RETURNS text AS $$
DECLARE
  encryption_key text;
BEGIN
  -- Get encryption key
  encryption_key := get_encryption_key();
  
  RETURN convert_from(
    decrypt(
      decode(encrypted_key, 'base64'),
      decode(encryption_key, 'hex'),
      'aes'
    ),
    'utf8'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure storage bucket exists and is properly configured
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'designs'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES (
      'designs',
      'designs',
      false
    );
  END IF;

  -- Update bucket configuration
  UPDATE storage.buckets
  SET 
    public = false,
    file_size_limit = 52428800, -- 50MB
    allowed_mime_types = ARRAY[
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/svg+xml'
    ]
  WHERE id = 'designs';
END $$;

-- Add proper storage policies
CREATE POLICY "design_access"
  ON storage.objects FOR ALL
  TO authenticated
  USING (
    bucket_id = 'designs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'designs'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND (lower(storage.extension(name)) = ANY (ARRAY['png', 'jpg', 'jpeg', 'gif', 'svg']))
  );

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_shop_id ON user_roles(shop_id);
CREATE INDEX IF NOT EXISTS idx_provider_settings_shop_id ON provider_settings(shop_id);
CREATE INDEX IF NOT EXISTS idx_provider_settings_status ON provider_settings(status);

-- Add updated_at trigger for secure settings
CREATE TRIGGER update_secure_settings_updated_at
  BEFORE UPDATE ON secure_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();