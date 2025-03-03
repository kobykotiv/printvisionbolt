/*
  # User Settings Schema
  
  1. Core Tables
    - user_settings (preferences)
    - user_favorites (bookmarks)
    - recent_items (history)
  
  2. Security
    - RLS policies for all tables
    - User-based access control
*/

-- Create user_settings table
CREATE TABLE user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  settings jsonb NOT NULL DEFAULT '{
    "autoSave": true,
    "theme": "system",
    "previewMode": "live",
    "gridSize": 12,
    "notifications": {
      "email": true,
      "push": true,
      "desktop": true
    },
    "recent": {
      "templates": [],
      "designs": [],
      "blueprints": []
    },
    "favorites": {
      "templates": [],
      "designs": [],
      "blueprints": []
    }
  }',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create user_favorites table
CREATE TABLE user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  item_type text NOT NULL,
  item_id uuid NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

-- Create recent_items table
CREATE TABLE recent_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  item_type text NOT NULL,
  item_id uuid NOT NULL,
  accessed_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE recent_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_settings
CREATE POLICY "Users can access own settings"
  ON user_settings FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_favorites
CREATE POLICY "Users can access own favorites"
  ON user_favorites FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for recent_items
CREATE POLICY "Users can access own recent items"
  ON recent_items FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_item ON user_favorites(item_type, item_id);
CREATE INDEX idx_recent_items_user_id ON recent_items(user_id);
CREATE INDEX idx_recent_items_item ON recent_items(item_type, item_id);
CREATE INDEX idx_recent_items_accessed_at ON recent_items(accessed_at DESC);

-- Add updated_at triggers
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create cleanup function for recent items
CREATE OR REPLACE FUNCTION cleanup_recent_items()
RETURNS void AS $$
BEGIN
  -- Keep only the 50 most recent items per user and type
  DELETE FROM recent_items
  WHERE id IN (
    SELECT id
    FROM (
      SELECT id,
             ROW_NUMBER() OVER (
               PARTITION BY user_id, item_type
               ORDER BY accessed_at DESC
             ) as rn
      FROM recent_items
    ) ranked
    WHERE rn > 50
  );
END;
$$ LANGUAGE plpgsql;