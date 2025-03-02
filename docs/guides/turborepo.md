# Turborepo Commands Guide

## Development Commands

### Run Dev Server for All Apps
```powershell
bun run dev
```
This will start the development servers for all applications in the monorepo.

### Run Dev Server for Specific App
```powershell
bun run dev --filter="app-name"
```
Replace `app-name` with your app's name to run development server for just that app.

## Build Commands

### Build All Apps
```powershell
bun run build
```
Builds all applications in the monorepo.

### Build Specific App
```powershell
bun run build --filter="app-name"
```
Builds only the specified app.

## Filter Patterns

The `--filter` flag accepts several patterns:

- `--filter="app-name"` - Target a specific app
- `--filter=".app-name"` - Target the app and its dependencies
- `--filter="...app-name"` - Target the app and both its dependencies and dependents

## Common Examples

1. Run dev server for web app:

```powershell
bun run dev --filter="web"
```

2. Build web app and its dependencies:

```powershell
bun run build --filter=".web"
```

3. Run tests for specific app:

```powershell
bun run test --filter="web"
```

## Note on Dependencies

The turborepo pipeline (defined in turbo.json) ensures that when you run a command on an app:
- All workspace dependencies are handled correctly
- Tasks run in the correct order based on the dependency graph
- Build outputs are cached for faster subsequent runs
- Bun's package manager handles all dependency installations

## Common Workflow Commands

### Install Dependencies
```powershell
bun install
```

### Clean Build Cache
```powershell
bun run clean
```

### Run Tests
```powershell
bun test
```

### Update Dependencies
```powershell
bun update
```

### Check for Outdated Dependencies
```powershell
bun outdated
```

Remember to:
- Use PowerShell syntax for command chaining (;)
- Keep installed package versions up to date
- Document changes in CHANGELOG.md
- Commit after significant changes