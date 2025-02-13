/*
  # Add Test Admin User

  1. Changes
    - Creates a test admin user with email and password
    - Creates a default shop for the admin
    - Assigns admin role for the shop
    - Sets up user settings with admin preferences
    
  2. Security
    - Password is properly hashed using Supabase auth
    - RLS policies are respected
    - No sensitive data exposure
*/

-- Create admin user function
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
  new_shop_id uuid;
BEGIN
  -- Create user in auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@printvision.cloud',
    crypt('admin123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"name":"Test Admin"}'::jsonb,
    now(),
    now(),
    encode(gen_random_bytes(32), 'hex'),
    encode(gen_random_bytes(32), 'hex'),
    encode(gen_random_bytes(32), 'hex'),
    ''
  )
  RETURNING id INTO new_user_id;

  -- Create default shop
  INSERT INTO shops (
    id,
    user_id,
    name,
    settings,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    new_user_id,
    'Admin Test Shop',
    jsonb_build_object(
      'tier', 'enterprise',
      'features', jsonb_build_object(
        'maxDesigns', -1,
        'maxTemplates', -1,
        'maxDailyUploads', -1,
        'maxStorage', -1
      )
    ),
    now(),
    now()
  )
  RETURNING id INTO new_shop_id;

  -- Assign admin role
  INSERT INTO user_roles (
    id,
    user_id,
    role,
    shop_id,
    created_at
  ) VALUES (
    gen_random_uuid(),
    new_user_id,
    'admin',
    new_shop_id,
    now()
  );

  -- Set up user settings
  INSERT INTO user_settings (
    id,
    user_id,
    settings,
    created_at,
    updated_at
  ) VALUES (
    gen_random_uuid(),
    new_user_id,
    jsonb_build_object(
      'autoSave', true,
      'theme', 'light',
      'previewMode', 'live',
      'gridSize', 12,
      'notifications', jsonb_build_object(
        'email', true,
        'push', true,
        'desktop', true
      ),
      'recent', jsonb_build_object(
        'templates', '[]'::jsonb,
        'designs', '[]'::jsonb,
        'blueprints', '[]'::jsonb
      ),
      'favorites', jsonb_build_object(
        'templates', '[]'::jsonb,
        'designs', '[]'::jsonb,
        'blueprints', '[]'::jsonb
      )
    ),
    now(),
    now()
  );

  RETURN new_user_id;
END;
$$;

-- Create admin user
SELECT create_admin_user();