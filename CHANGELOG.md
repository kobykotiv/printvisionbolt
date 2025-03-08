# Changelog

## [1.0.1] - 2025-03-05

### Changed
- Migrated entire monorepo to use Bun as package manager
  - Added packageManager field (bun@1.0.25) to root package.json
  - Added packageManager field to all apps/* package.json files:
    - apps/api/package.json
    - apps/blog/package.json
    - apps/dashboard/package.json
    - apps/web/package.json
    - apps/stores/default/package.json
  - Added packageManager field to all packages/* package.json files:
    - packages/api/package.json
    - packages/api-client/package.json
    - packages/api-types/package.json
    - packages/dashboard/package.json
    - packages/eslint-config/package.json
    - packages/ui/package.json
- Updated dependency versions for Bun compatibility
- Configured workspace settings for Bun monorepo setup

### Added
- Bun version requirement (>=1.0.25) in engines field
- Workspace configuration for Bun monorepo structure
