/*
  # Tiered Pricing System Implementation

  1. Changes
    - Creates subscription_tiers table for tier definitions
    - Creates user_subscriptions table for active subscriptions
    - Creates subscription_features table for feature flags
    - Creates usage_limits table for tier-specific limits
    - Creates usage_tracking table for monitoring
    - Adds functions for limit validation and usage tracking
    
  2. Security
    - RLS policies for all tables
    - Secure functions for limit validation
    - Usage tracking protection
*/

-- Create subscription tiers enum
CREATE TYPE subscription_tier AS ENUM ('free', 'creator', 'pro', 'enterprise');

-- Create subscription status enum
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'canceled', 'trialing');

-- Create subscription_tiers table
CREATE TABLE subscription_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name subscription_tier NOT NULL UNIQUE,
  display_name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  billing_period interval NOT NULL DEFAULT '1 month'::interval,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscription_features table
CREATE TABLE subscription_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_id uuid REFERENCES subscription_tiers(id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  feature_value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tier_id, feature_key)
);

-- Create usage_limits table
CREATE TABLE usage_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_id uuid REFERENCES subscription_tiers(id) ON DELETE CASCADE,
  limit_key text NOT NULL,
  limit_value integer NOT NULL,
  reset_period interval,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tier_id, limit_key)
);

-- Create user_subscriptions table
CREATE TABLE user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  tier_id uuid REFERENCES subscription_tiers(id),
  status subscription_status NOT NULL DEFAULT 'active',
  current_period_start timestamptz NOT NULL DEFAULT now(),
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  payment_method_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create usage_tracking table
CREATE TABLE usage_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_id uuid REFERENCES shops(id) ON DELETE CASCADE,
  tracking_date date NOT NULL DEFAULT CURRENT_DATE,
  metric_key text NOT NULL,
  metric_value integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, shop_id, tracking_date, metric_key)
);

-- Enable RLS
ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public read access to subscription tiers"
  ON subscription_tiers FOR SELECT TO authenticated USING (true);

CREATE POLICY "Public read access to subscription features"
  ON subscription_features FOR SELECT TO authenticated USING (true);

CREATE POLICY "Public read access to usage limits"
  ON usage_limits FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can read their own subscriptions"
  ON user_subscriptions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read their own usage tracking"
  ON usage_tracking FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Create function to check usage limits
CREATE OR REPLACE FUNCTION check_usage_limit(
  p_user_id uuid,
  p_shop_id uuid,
  p_metric_key text,
  p_increment integer DEFAULT 1
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_tier_id uuid;
  v_limit integer;
  v_current_usage integer;
BEGIN
  -- Get user's current tier
  SELECT tier_id INTO v_tier_id
  FROM user_subscriptions
  WHERE user_id = p_user_id
  AND status = 'active';

  -- Get limit for this metric
  SELECT limit_value INTO v_limit
  FROM usage_limits
  WHERE tier_id = v_tier_id
  AND limit_key = p_metric_key;

  -- Get current usage
  SELECT COALESCE(SUM(metric_value), 0) INTO v_current_usage
  FROM usage_tracking
  WHERE user_id = p_user_id
  AND shop_id = p_shop_id
  AND metric_key = p_metric_key
  AND tracking_date = CURRENT_DATE;

  -- Check if increment would exceed limit
  -- -1 means unlimited
  IF v_limit = -1 OR (v_current_usage + p_increment) <= v_limit THEN
    -- Update usage tracking
    INSERT INTO usage_tracking (
      user_id,
      shop_id,
      metric_key,
      metric_value,
      tracking_date
    ) VALUES (
      p_user_id,
      p_shop_id,
      p_metric_key,
      p_increment,
      CURRENT_DATE
    )
    ON CONFLICT (user_id, shop_id, tracking_date, metric_key)
    DO UPDATE SET
      metric_value = usage_tracking.metric_value + p_increment;

    RETURN true;
  END IF;

  RETURN false;
END;
$$;

-- Create function to get current usage
CREATE OR REPLACE FUNCTION get_current_usage(
  p_user_id uuid,
  p_shop_id uuid,
  p_metric_key text
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_usage integer;
BEGIN
  SELECT COALESCE(SUM(metric_value), 0) INTO v_usage
  FROM usage_tracking
  WHERE user_id = p_user_id
  AND shop_id = p_shop_id
  AND metric_key = p_metric_key
  AND tracking_date = CURRENT_DATE;

  RETURN v_usage;
END;
$$;

-- Insert default tiers
INSERT INTO subscription_tiers (name, display_name, description, price) VALUES
  ('free', 'Free', 'Basic features for getting started', 0),
  ('creator', 'Creator', 'Perfect for individual creators', 19),
  ('pro', 'Professional', 'Advanced features for growing businesses', 49),
  ('enterprise', 'Enterprise', 'Custom solutions for large operations', 99);

-- Insert feature flags
INSERT INTO subscription_features (tier_id, feature_key, feature_value)
SELECT 
  t.id,
  f.key,
  f.value
FROM subscription_tiers t
CROSS JOIN (
  VALUES 
    ('api_access', '{"enabled": false}'::jsonb),
    ('custom_domain', '{"enabled": false}'::jsonb),
    ('priority_support', '{"enabled": false}'::jsonb),
    ('white_label', '{"enabled": false}'::jsonb)
) AS f(key, value)
WHERE t.name = 'free'
UNION ALL
SELECT 
  t.id,
  f.key,
  f.value
FROM subscription_tiers t
CROSS JOIN (
  VALUES 
    ('api_access', '{"enabled": true}'::jsonb),
    ('custom_domain', '{"enabled": false}'::jsonb),
    ('priority_support', '{"enabled": false}'::jsonb),
    ('white_label', '{"enabled": false}'::jsonb)
) AS f(key, value)
WHERE t.name = 'creator'
UNION ALL
SELECT 
  t.id,
  f.key,
  f.value
FROM subscription_tiers t
CROSS JOIN (
  VALUES 
    ('api_access', '{"enabled": true}'::jsonb),
    ('custom_domain', '{"enabled": true}'::jsonb),
    ('priority_support', '{"enabled": true}'::jsonb),
    ('white_label', '{"enabled": false}'::jsonb)
) AS f(key, value)
WHERE t.name = 'pro'
UNION ALL
SELECT 
  t.id,
  f.key,
  f.value
FROM subscription_tiers t
CROSS JOIN (
  VALUES 
    ('api_access', '{"enabled": true}'::jsonb),
    ('custom_domain', '{"enabled": true}'::jsonb),
    ('priority_support', '{"enabled": true}'::jsonb),
    ('white_label', '{"enabled": true}'::jsonb)
) AS f(key, value)
WHERE t.name = 'enterprise';

-- Insert usage limits
INSERT INTO usage_limits (tier_id, limit_key, limit_value, reset_period)
SELECT 
  t.id,
  l.key,
  l.value,
  l.reset_period
FROM subscription_tiers t
CROSS JOIN (
  VALUES 
    ('designs', 100, '1 month'::interval),
    ('templates', 10, '1 month'::interval),
    ('daily_uploads', 50, '1 day'::interval),
    ('storage_mb', 5120, NULL), -- 5GB
    ('api_requests', 1000, '1 day'::interval)
) AS l(key, value, reset_period)
WHERE t.name = 'free'
UNION ALL
SELECT 
  t.id,
  l.key,
  l.value,
  l.reset_period
FROM subscription_tiers t
CROSS JOIN (
  VALUES 
    ('designs', 500, '1 month'::interval),
    ('templates', 50, '1 month'::interval),
    ('daily_uploads', 200, '1 day'::interval),
    ('storage_mb', 51200, NULL), -- 50GB
    ('api_requests', 10000, '1 day'::interval)
) AS l(key, value, reset_period)
WHERE t.name = 'creator'
UNION ALL
SELECT 
  t.id,
  l.key,
  l.value,
  l.reset_period
FROM subscription_tiers t
CROSS JOIN (
  VALUES 
    ('designs', 2000, '1 month'::interval),
    ('templates', 200, '1 month'::interval),
    ('daily_uploads', 1000, '1 day'::interval),
    ('storage_mb', 512000, NULL), -- 500GB
    ('api_requests', 100000, '1 day'::interval)
) AS l(key, value, reset_period)
WHERE t.name = 'pro'
UNION ALL
SELECT 
  t.id,
  l.key,
  l.value,
  l.reset_period
FROM subscription_tiers t
CROSS JOIN (
  VALUES 
    ('designs', -1, '1 month'::interval),
    ('templates', -1, '1 month'::interval),
    ('daily_uploads', -1, '1 day'::interval),
    ('storage_mb', -1, NULL),
    ('api_requests', -1, '1 day'::interval)
) AS l(key, value, reset_period)
WHERE t.name = 'enterprise';

-- Add indexes for performance
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_tier_id ON user_subscriptions(tier_id);
CREATE INDEX idx_usage_tracking_user_shop ON usage_tracking(user_id, shop_id);
CREATE INDEX idx_usage_tracking_date ON usage_tracking(tracking_date);
CREATE INDEX idx_usage_tracking_metric ON usage_tracking(metric_key);

-- Add updated_at triggers
CREATE TRIGGER update_subscription_tiers_updated_at
  BEFORE UPDATE ON subscription_tiers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_features_updated_at
  BEFORE UPDATE ON subscription_features
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_limits_updated_at
  BEFORE UPDATE ON usage_limits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_tracking_updated_at
  BEFORE UPDATE ON usage_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();