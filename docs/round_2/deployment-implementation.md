# PrintVision.Cloud Deployment Implementation Guide

## 1. Infrastructure Setup

### Server Requirements
```bash
# System requirements
CPU: 4 cores minimum
RAM: 8GB minimum
Storage: 50GB SSD
OS: Ubuntu 20.04 LTS
```

### Initial Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx

# Start Docker
sudo systemctl enable docker
sudo systemctl start docker
```

## 2. Application Configuration

### Environment Setup
```bash
# Create configuration directory
mkdir -p /opt/printvision/config

# Generate environment files
cat > /opt/printvision/config/.env <<EOL
NODE_ENV=production
VITE_SUPABASE_URL=https://your-supabase-instance.com
VITE_SUPABASE_ANON_KEY=your-anon-key
REDIS_URL=redis://redis:6379
DATABASE_URL=postgresql://postgres:password@supabase:5432/postgres
JWT_SECRET=your-secure-jwt-secret
EOL
```

### Coolify Setup
```bash
# Install Coolify
curl -sSL https://get.coollabs.io/coolify/install.sh | bash

# Configure Coolify
coolify service init --mode production

# Add application
coolify app create \
  --name printvision \
  --repo https://github.com/your-org/printvision \
  --branch main \
  --build-command "pnpm install && pnpm build" \
  --start-command "pnpm start"
```

## 3. Database Configuration

### Supabase Installation
```bash
# Create Supabase directory
mkdir -p /opt/supabase
cd /opt/supabase

# Clone Supabase
git clone https://github.com/supabase/supabase-docker.git .

# Configure Supabase
cp .env.example .env
```

### Database Initialization
```sql
-- init.sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create schema
CREATE SCHEMA IF NOT EXISTS public;

-- Create tables
CREATE TABLE public.users (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Set up Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

## 4. Security Configuration

### SSL Setup
```bash
# Generate SSL certificate
sudo certbot --nginx -d your-domain.com

# Configure Nginx with SSL
cat > /etc/nginx/sites-available/printvision.conf <<EOL
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL
```

## 5. Monitoring Setup

### Health Checks
```typescript
// src/lib/monitoring/health.ts
export async function healthCheck() {
  return {
    database: await checkDatabase(),
    redis: await checkRedis(),
    api: await checkAPI(),
    timestamp: new Date().toISOString()
  };
}
```

### Logging Configuration
```typescript
// src/lib/logging/winston.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'printvision' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## 6. Deployment Process

### Build Process
```bash
#!/bin/bash
# deploy.sh

# Pull latest changes
git pull origin main

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build application
pnpm build

# Deploy to Coolify
coolify deploy printvision
```

### Database Migration
```bash
#!/bin/bash
# migrate.sh

# Run migrations
pnpm migrate up

# Verify migration
pnpm migrate status
```

## 7. Validation Steps

### Pre-deployment Checks
```bash
#!/bin/bash
# validate.sh

# Check environment variables
source scripts/check-env.sh

# Verify database connection
pnpm run db:check

# Run security audit
pnpm audit

# Check bundle size
pnpm run analyze
```

### Post-deployment Checks
```typescript
// src/scripts/validate-deployment.ts
async function validateDeployment() {
  // Check API endpoints
  const healthCheck = await fetch('/api/health');
  assert(healthCheck.ok);

  // Verify database connections
  const dbCheck = await checkDatabaseConnections();
  assert(dbCheck.success);

  // Test authentication
  const authCheck = await testAuthentication();
  assert(authCheck.success);

  console.log('Deployment validation successful');
}
```

## 8. Backup Procedures

### Database Backup
```bash
#!/bin/bash
# backup-db.sh

# Set variables
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/printvision/backups"

# Create backup
pg_dump $DATABASE_URL > "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

# Compress backup
gzip "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

# Cleanup old backups (keep last 7 days)
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete
```

### File Storage Backup
```bash
#!/bin/bash
# backup-files.sh

# Backup application files
tar -czf "$BACKUP_DIR/files_$TIMESTAMP.tar.gz" /opt/printvision/uploads

# Sync to backup storage
rclone sync $BACKUP_DIR backup:printvision-backups
```

## 9. Monitoring & Alerts

### Error Tracking
```typescript
// src/lib/monitoring/sentry.ts
import * as Sentry from '@sentry/node';

export function initializeSentry() {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express()
    ]
  });
}
```

### Performance Monitoring
```typescript
// src/lib/monitoring/metrics.ts
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

export function setupMetrics() {
  const exporter = new PrometheusExporter({
    port: 9464,
    startServer: true
  });

  const metrics = {
    httpRequestDuration: new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds'
    }),
    databaseQueryDuration: new Histogram({
      name: 'database_query_duration_seconds',
      help: 'Duration of database queries in seconds'
    })
  };

  return metrics;
}
```

## 10. Rollback Procedures

### Application Rollback
```bash
#!/bin/bash
# rollback.sh

VERSION=$1

if [ -z "$VERSION" ]; then
  echo "Usage: ./rollback.sh <version>"
  exit 1
fi

# Stop current deployment
coolify app stop printvision

# Rollback to specified version
coolify app rollback printvision $VERSION

# Verify deployment
./scripts/validate-deployment.sh
```

### Database Rollback
```bash
#!/bin/bash
# rollback-db.sh

VERSION=$1

if [ -z "$VERSION" ]; then
  echo "Usage: ./rollback-db.sh <version>"
  exit 1
fi

# Rollback database
pnpm migrate down $VERSION

# Verify database state
pnpm migrate status
```

## 11. Troubleshooting Guide

### Common Issues
1. Database Connection Issues
```bash
# Check database connectivity
pg_isready -h localhost -p 5432

# View database logs
docker logs supabase_db
```

2. Application Errors
```bash
# View application logs
coolify logs printvision

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
```

3. SSL Issues
```bash
# Test SSL configuration
ssl-check your-domain.com

# Renew certificates
sudo certbot renew --dry-run
```

## 12. Maintenance Procedures

### Regular Maintenance
```bash
#!/bin/bash
# maintenance.sh

# Update system packages
sudo apt update && sudo apt upgrade -y

# Rotate logs
logrotate /etc/logrotate.d/printvision

# Cleanup old docker images
docker system prune -f

# Backup database
./scripts/backup-db.sh

# Check disk usage
df -h
```

### Performance Optimization
```bash
# Optimize database
pg_repack -d printvision

# Clear Redis cache
redis-cli FLUSHDB

# Update index statistics
ANALYZE VERBOSE