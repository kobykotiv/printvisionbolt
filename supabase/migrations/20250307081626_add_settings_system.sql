-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for encryption functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Add profile fields to auth.users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS company_name text;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS settings jsonb DEFAULT '{}'::jsonb;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS billing_customer_id text;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS subscription_status text;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS subscription_plan text;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS subscription_period_end timestamptz;

-- Create API keys table with encryption
CREATE TABLE IF NOT EXISTS api_keys (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    key_hash text NOT NULL, -- Store hashed version for verification
    key_salt text NOT NULL, -- Unique salt per key
    encrypted_key text NOT NULL, -- Encrypted original for display last 4
    provider text NOT NULL CHECK (provider IN ('printful', 'printify', 'gooten', 'gelato')),
    created_at timestamptz DEFAULT now(),
    last_used timestamptz,
    expires_at timestamptz,
    metadata jsonb DEFAULT '{}'::jsonb,
    active boolean DEFAULT true,
    UNIQUE(user_id, provider)
);

-- Create store settings table
CREATE TABLE IF NOT EXISTS store_settings (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    store_name text NOT NULL,
    provider_connections jsonb DEFAULT '[]'::jsonb,
    settings jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create audit log for security events
CREATE TABLE IF NOT EXISTS security_audit_logs (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type text NOT NULL,
    ip_address text,
    user_agent text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY api_keys_user_policy ON api_keys
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY store_settings_user_policy ON store_settings
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY security_logs_select_policy ON security_audit_logs
    FOR SELECT USING (user_id = auth.uid());

-- Functions for API key management
CREATE OR REPLACE FUNCTION create_api_key(
    p_user_id uuid,
    p_name text,
    p_provider text
) RETURNS text AS $$
DECLARE
    v_api_key text;
    v_salt text;
    v_hash text;
    v_encrypted text;
BEGIN
    -- Generate new API key
    v_api_key := encode(gen_random_bytes(32), 'hex');
    
    -- Generate salt
    v_salt := encode(gen_random_bytes(16), 'hex');
    
    -- Create hash
    v_hash := encode(digest(v_api_key || v_salt, 'sha256'), 'hex');
    
    -- Encrypt key for storage
    v_encrypted := encode(
        encrypt(
            v_api_key::bytea,
            current_setting('app.settings.encryption_key')::bytea,
            'aes'
        ),
        'hex'
    );

    -- Insert new key
    INSERT INTO api_keys (
        user_id, name, provider, key_hash, key_salt, encrypted_key
    ) VALUES (
        p_user_id, p_name, p_provider, v_hash, v_salt, v_encrypted
    );

    -- Return the generated key
    RETURN v_api_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to verify API key
CREATE OR REPLACE FUNCTION verify_api_key(
    p_api_key text,
    p_provider text
) RETURNS uuid AS $$
DECLARE
    v_user_id uuid;
    v_hash text;
BEGIN
    SELECT user_id, encode(digest(p_api_key || key_salt, 'sha256'), 'hex')
    INTO v_user_id, v_hash
    FROM api_keys
    WHERE provider = p_provider
    AND active = true
    AND (expires_at IS NULL OR expires_at > now())
    LIMIT 1;

    IF v_hash = key_hash THEN
        -- Update last used timestamp
        UPDATE api_keys
        SET last_used = now()
        WHERE user_id = v_user_id AND provider = p_provider;
        
        RETURN v_user_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update store_settings.updated_at
CREATE OR REPLACE FUNCTION update_store_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER store_settings_timestamp
    BEFORE UPDATE ON store_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_store_settings_timestamp();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_provider ON api_keys(provider);
CREATE INDEX IF NOT EXISTS idx_store_settings_user_id ON store_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_user_id ON security_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_audit_logs(created_at);