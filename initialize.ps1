# PowerShell script to initialize the monorepo

Write-Host "🚀 Initializing PrintVision Bolt monorepo..." -ForegroundColor Green

# Install bun if not already installed
if (!(Get-Command bun -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Bun..." -ForegroundColor Yellow
    curl -fsSL https://bun.sh/install | powershell
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
bun install

# Build packages in correct order
Write-Host "Building packages..." -ForegroundColor Yellow
bun run build

# Setup git hooks
Write-Host "Setting up git hooks..." -ForegroundColor Yellow
if (!(Test-Path .git/hooks)) {
    mkdir .git/hooks
}
Copy-Item ./scripts/pre-commit.sh .git/hooks/pre-commit

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host @"

Next steps:
1. Start the development server: bun run dev
2. Open http://localhost:3000

Documentation:
- Project structure: docs/structure.md
- Contributing: docs/contributing.md

"@ -ForegroundColor Cyan