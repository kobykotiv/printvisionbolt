# PrintVision.Cloud Deployment Blueprint

## Infrastructure Architecture

### 1. Core Services

```mermaid
graph TD
    Client[React/Vite App] --> Nginx[Nginx Reverse Proxy]
    Nginx --> App[Coolify App Service]
    App --> Supabase[Self-hosted Supabase]
    App --> Redis[Redis Cache]
    Supabase --> PostgreSQL[PostgreSQL Database]
```

### 2. Configuration Files

#### Docker Compose (Base Infrastructure)
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      NODE_ENV: production
      VITE_SUPABASE_URL: ${SUPABASE_URL}
      VITE_SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY}
    ports:
      - "3000:3000"
    depends_on:
      - redis
      - supabase

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  supabase:
    image: supabase/supabase-ce
    ports:
      - "8000:8000"
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      DASHBOARD_USERNAME: ${DASHBOARD_USER}
      DASHBOARD_PASSWORD: ${DASHBOARD_PASSWORD}
    volumes:
      - supabase_data:/var/lib/postgresql/data

volumes:
  redis_data:
  supabase_data:
```

#### Nginx Configuration
```nginx
# nginx.conf
server {
    listen 80;
    server_name printvision.cloud;

    location / {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Supabase API endpoints
    location /rest {
        proxy_pass http://supabase:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@shadcn/ui'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 3. Database Schema & Migrations

```sql
-- migrations/01_initial_schema.sql
CREATE TABLE public.users (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.shops (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON public.users
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can manage own shops"
    ON public.shops
    USING (auth.uid() = user_id);
```

### 4. Environment Configuration

```env
# .env.production
NODE_ENV=production
VITE_SUPABASE_URL=https://your-supabase-instance.com
VITE_SUPABASE_ANON_KEY=your-anon-key
REDIS_URL=redis://redis:6379
DATABASE_URL=postgresql://postgres:password@supabase:5432/postgres
```

### 5. Application Dockerfile

```dockerfile
# Dockerfile
FROM node:20-alpine as builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy built assets
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .

EXPOSE 3000

CMD ["npm", "start"]
```

## Deployment Process

### 1. Initial Setup

1. Configure Coolify:
```bash
# Install Coolify
curl -sSL https://get.coollabs.io/coolify/install.sh | bash

# Configure service
coolify service add
```

2. Set up self-hosted Supabase:
```bash
# Clone Supabase
git clone https://github.com/supabase/supabase
cd supabase

# Configure and start
cp .env.example .env
docker-compose up -d
```

### 2. Application Deployment

1. Create deployment pipeline:
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '20'
          
      - name: Install pnpm
        run: npm install -g pnpm
          
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
        
      - name: Build
        run: pnpm build
        
      - name: Deploy to Coolify
        run: curl -X POST ${{ secrets.COOLIFY_WEBHOOK }}
```

### 3. Database Migration Process

```typescript
// src/lib/db/migrate.ts
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const migrations = fs
    .readdirSync(path.join(__dirname, 'migrations'))
    .sort();

  for (const migration of migrations) {
    const sql = fs.readFileSync(
      path.join(__dirname, 'migrations', migration),
      'utf8'
    );
    await supabase.from('migrations').insert({ name: migration });
    await supabase.rpc('run_migration', { sql });
  }
}
```

### 4. Monitoring & Health Checks

```typescript
// src/lib/monitoring/health.ts
export async function healthCheck() {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    supabase: await checkSupabase()
  };

  return {
    status: Object.values(checks).every(check => check.status === 'healthy')
      ? 'healthy'
      : 'unhealthy',
    checks
  };
}
```

### 5. Backup Strategy

```bash
#!/bin/bash
# backup.sh

# Database backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Upload to storage
aws s3 cp backup_$(date +%Y%m%d).sql s3://backup-bucket/

# Cleanup old backups
find . -name "backup_*.sql" -mtime +7 -delete
```

## Security Considerations

1. Network Security:
```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN";
add_header X-XSS-Protection "1; mode=block";
add_header X-Content-Type-Options "nosniff";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Content-Security-Policy "default-src 'self';";
```

2. Database Security:
```sql
-- Enable SSL
ALTER SYSTEM SET ssl = on;
ALTER SYSTEM SET ssl_cert_file = 'server.crt';
ALTER SYSTEM SET ssl_key_file = 'server.key';

-- Configure connection limits
ALTER SYSTEM SET max_connections = 100;
```

3. API Security:
```typescript
// src/middleware/auth.ts
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const user = await supabase.auth.getUser(token);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
```

## Rollback Procedures

```bash
#!/bin/bash
# rollback.sh

# Get deployment ID
DEPLOY_ID=$1

# Stop current deployment
coolify deployment stop latest

# Rollback to previous version
coolify deployment rollback $DEPLOY_ID

# Verify health
curl -f http://localhost/health || exit 1
```

## Monitoring & Alerts

1. Setup monitoring:
```typescript
// src/lib/monitoring/setup.ts
import { Sentry } from '@sentry/node';

export function setupMonitoring() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
  });
}
```

2. Configure alerts:
```yaml
# alerting.yml
rules:
  - alert: HighErrorRate
    expr: error_rate > 0.01
    for: 5m
    labels:
      severity: critical
    annotations:
      description: Error rate exceeded 1% for 5 minutes
```

## Documentation Updates

1. Update API documentation
2. Update deployment guides
3. Update monitoring documentation
4. Update security procedures
5. Update backup/restore procedures

## Validation Checklist

- [ ] Database migrations tested
- [ ] Security configurations verified
- [ ] Backup procedures tested
- [ ] Monitoring systems configured
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Rollback procedures tested
- [ ] Security scan completed