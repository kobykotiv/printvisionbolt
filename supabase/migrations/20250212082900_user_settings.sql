-- Create user_settings table
CREATE TABLE user_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  settings JSONB NOT NULL DEFAULT '{
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
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Create user_preferences table for specific feature preferences
CREATE TABLE user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, feature_key)
);

-- Create user_favorites for more efficient querying of favorite items
CREATE TABLE user_favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- 'template', 'design', 'blueprint'
  item_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, item_type, item_id)
);

-- Create recent_items for tracking user's recent activity
CREATE TABLE recent_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL, -- 'template', 'design', 'blueprint'
  item_id TEXT NOT NULL,
  accessed_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, item_type, item_id)
);

-- Add indexes for better query performance
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX idx_user_preferences_user_feature ON user_preferences(user_id, feature_key);
CREATE INDEX idx_user_favorites_user_type ON user_favorites(user_id, item_type);
CREATE INDEX idx_recent_items_user_type ON recent_items(user_id, item_type);
CREATE INDEX idx_recent_items_accessed_at ON recent_items(accessed_at DESC);

-- Add RLS policies
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE recent_items ENABLE ROW LEVEL SECURITY;

-- Users can only read their own settings
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own settings
CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only read their own preferences
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only read their own favorites
CREATE POLICY "Users can view own favorites"
  ON user_favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Users can manage their own favorites
CREATE POLICY "Users can insert own favorites"
  ON user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON user_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Users can only read their own recent items
CREATE POLICY "Users can view own recent items"
  ON recent_items FOR SELECT
  USING (auth.uid() = user_id);

-- Users can manage their own recent items
CREATE POLICY "Users can insert own recent items"
  ON recent_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own recent items"
  ON recent_items FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Function to clean up old recent items
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

-- Create a scheduled job to clean up recent items daily
SELECT cron.schedule(
  'cleanup-recent-items',
  '0 0 * * *', -- Run at midnight every day
  'SELECT cleanup_recent_items();'
);