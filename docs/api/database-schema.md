# Database Schema Documentation

## Shop Provider Schema

```sql
CREATE TABLE shops (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE shop_providers (
  id UUID PRIMARY KEY,
  shop_id UUID REFERENCES shops(id),
  provider_type VARCHAR(50) NOT NULL,
  credentials JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(shop_id, provider_type)
);

-- Prevent multiple instances of same provider type per shop
CREATE UNIQUE INDEX unique_shop_provider_type 
ON shop_providers(shop_id, provider_type);
```

