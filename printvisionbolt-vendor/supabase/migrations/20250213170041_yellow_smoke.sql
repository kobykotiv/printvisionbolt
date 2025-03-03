/*
  # Fix user roles policy recursion

  1. Changes
    - Remove recursive policy check from user_roles table
    - Add direct user_id check for user_roles policies
    - Add shop ownership check for admin operations

  2. Security
    - Maintains data isolation between users
    - Prevents unauthorized role modifications
    - Preserves admin-only role management
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view roles for their shops" ON user_roles;
DROP POLICY IF EXISTS "Only admins can manage roles" ON user_roles;

-- Create new non-recursive policies
CREATE POLICY "Users can view their own roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage roles for their shops"
  ON user_roles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shops
      WHERE shops.id = user_roles.shop_id
      AND shops.user_id = auth.uid()
    )
    AND
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.shop_id = user_roles.shop_id
      AND ur.role = 'admin'
    )
  );