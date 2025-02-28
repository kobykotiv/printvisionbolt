/*
  # Fix Role Policies and Add Missing Indexes

  1. Changes
    - Fixes infinite recursion in user_roles policies
    - Adds missing indexes for performance
    - Simplifies policy logic
*/

-- First drop all problematic policies
DROP POLICY IF EXISTS "Users can view roles for their shops" ON user_roles;
DROP POLICY IF EXISTS "Only admins can manage roles" ON user_roles;
DROP POLICY IF EXISTS "Users can access shop designs" ON designs;
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "View own roles" ON user_roles;
DROP POLICY IF EXISTS "Manage shop roles" ON user_roles;
DROP POLICY IF EXISTS "role_access" ON user_roles;
DROP POLICY IF EXISTS "role_management" ON user_roles;

-- Create new non-recursive policies
CREATE POLICY "view_own_roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "manage_roles"
  ON user_roles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shops
      WHERE shops.id = user_roles.shop_id
      AND shops.user_id = auth.uid()
    )
  );

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_composite ON user_roles(user_id, shop_id);
CREATE INDEX IF NOT EXISTS idx_designs_shop_id ON designs(shop_id);
CREATE INDEX IF NOT EXISTS idx_designs_user_id ON designs(user_id);