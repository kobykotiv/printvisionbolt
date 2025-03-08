# PrintVisionBolt Monorepo Structure

## Overview

PrintVisionBolt is structured as a Turborepo-powered monorepo using pnpm workspaces. This document outlines the key architectural decisions and setup.

## Package Structure

```
printvisionbolt/
├── packages/
│   ├── blog/               # Blog application
│   ├── dashboard/          # Admin dashboard
│   └── shared-ui/          # Shared UI components
└── docs/                   # Documentation
```

## Key Configuration

### Package Manager
- Using pnpm (v9.0.0)
- Node.js >= 18.x required

### Workspace Setup
- All packages located in `packages/*`
- Shared dependencies hoisted to root
- Workspace dependencies use `workspace:*` protocol

### Build System
- Turbopack as the build tool
- Turborepo for monorepo orchestration
- TypeScript in strict mode

### Applications
1. Dashboard (`@printvisionbolt/dashboard`)
   - Next.js application
   - Uses shared-ui components
   - Independently deployable

2. Blog (`@printvisionbolt/blog`)
   - Next.js application
   - Uses shared-ui components
   - Independently deployable

3. Shared UI (`@printvisionbolt/shared-ui`)
   - Common component library
   - TypeScript-first
   - Used by both blog and dashboard

### Development Commands
```bash
# Development
bun dev                    # Run all apps
bun dev --filter=blog      # Run only blog
bun dev --filter=dashboard # Run only dashboard

# Building
bun build                  # Build all packages
bun lint                   # Lint all packages
bun format                 # Format all files
```

### CI/CD Integration
- GitHub Actions for CI/CD
- Blue-green deployment strategy
- Auto-scaling enabled
- Container registry: ghcr.io

### Development Standards
- Prettier for code formatting
- ESLint for code quality
- Conventional commits
- Feature branch workflow
