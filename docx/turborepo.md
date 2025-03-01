# Turborepo Commands Guide

## Development Commands

### Run Dev Server for All Apps
```powershell
pnpm run dev
```
This will start the development servers for all applications in the monorepo.

### Run Dev Server for Specific App
```powershell
pnpm run dev --filter=<app-name>
```
Replace `<app-name>` with your app's name to run development server for just that app.

## Build Commands

### Build All Apps
```powershell
pnpm run build
```
Builds all applications in the monorepo.

### Build Specific App
```powershell
pnpm run build --filter=<app-name>
```
Builds only the specified app.

## Filter Patterns

The `--filter` flag accepts several patterns:

- `--filter=<app-name>` - Target a specific app
- `--filter=.<app-name>` - Target the app and its dependencies
- `--filter=...<app-name>` - Target the app and both its dependencies and dependents

## Common Examples

1. Run dev server for web app:
```powershell
pnpm run dev --filter=web
```

2. Build web app and its dependencies:
```powershell
pnpm run build --filter=.web
```

3. Run tests for specific app:
```powershell
pnpm run test --filter=web
```

## Note on Dependencies

The turborepo pipeline (defined in turbo.json) ensures that when you run a command on an app:
- All workspace dependencies are handled correctly
- Tasks run in the correct order based on the dependency graph
- Build outputs are cached for faster subsequent runs