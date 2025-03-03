/*
  # Fix Database Policies and Configuration

  1. Changes
    - Drop and recreate user role policies to fix recursion
    - Add proper provider settings encryption
    - Fix shop access policies
    - Add storage configuration

  2. Features
    - Non-recursive role policies
    - Secure API key storage
    - Proper shop access control
    - Storage bucket setup
*/

-- First drop all problematic policies
DROP POLICY IF EXISTS "Users can view roles for their shops" ON user_roles;
DROP POLICY IF EXISTS "Only admins can manage roles" ON user_roles;
DROP POLICY IF EXISTS "Users can access shop designs" ON designs;
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "View own roles" ON user_roles;
DROP POLICY IF EXISTS "Manage shop roles" ON user_roles;

-- Create new non-recursive policies for user roles
CREATE POLICY "access_own_roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "manage_shop_roles"
  ON user_roles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shops
      WHERE shops.id = user_roles.shop_id
      AND shops.user_id = auth.uid()
    )
  );

-- Create encryption key table
CREATE TABLE IF NOT EXISTS app_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert encryption key if it doesn't exist
INSERT INTO app_settings (key, value)
SELECT 'encryption_key', encode(sha256(gen_random_uuid()::text::bytea), 'hex')
WHERE NOT EXISTS (
  SELECT 1 FROM app_settings WHERE key = 'encryption_key'
);

-- Create function to get encryption key
CREATE OR REPLACE FUNCTION get_encryption_key()
RETURNS text AS $$
BEGIN
  RETURN (SELECT value FROM app_settings WHERE key = 'encryption_key');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate provider settings encryption function
CREATE OR REPLACE FUNCTION encrypt_api_key() 
RETURNS trigger AS $$
BEGIN
  -- Only encrypt if the API key has changed
  IF TG_OP = 'INSERT' OR NEW.api_key <> OLD.api_key THEN
    NEW.api_key = encode(
      encrypt(
        convert_to(NEW.api_key, 'utf8'),
        decode(get_encryption_key(), 'hex'),
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
BEGIN
  RETURN convert_from(
    decrypt(
      decode(encrypted_key, 'base64'),
      decode(get_encryption_key(), 'hex'),
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
CREATE POLICY "user_design_access"
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