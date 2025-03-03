# PrintVision Bolt

A modern print-on-demand platform with multi-vendor support and glassomorphic UI.

## Tech Stack

- **Frontend**: Next.js 13+ with App Router
- **Backend**: tRPC with Express
- **Database**: Self-hosted Supabase
- **UI**: Custom Glassomorphic UI System
- **Package Manager**: Bun
- **Build Tool**: Turbopack
- **Language**: TypeScript 5.0+

## Project Structure

```
vendor/
├── apps/
│   ├── api/               # Backend API service
│   ├── vendor/           # Vendor dashboard
│   ├── storefront/       # Customer-facing storefront
│   └── shared/           # Shared components and utilities
├── packages/
│   ├── ui/              # UI component library
│   ├── utils/           # Shared utilities
│   └── types/           # TypeScript types/interfaces
└── infrastructure/      # Infrastructure as code
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```powershell
   ./initialize.ps1
   ```

3. Start the development server:
   ```bash
   bun run dev
   ```

## Development

- **API**: Runs on `http://localhost:3001`
- **Vendor Dashboard**: Runs on `http://localhost:3000`
- **Storefront**: Runs on `http://localhost:3002`

## Features

- 🎨 Glassomorphic UI system with customizable gradient accents
- 🌙 Dark mode support
- 🔒 Self-hosted Supabase for complete data control
- ⚡ End-to-end type safety with tRPC
- 📦 Monorepo structure with Turborepo
- 🚀 Fast development with Bun

## Contributing

1. Create a new branch
2. Make your changes
3. Submit a pull request

The pre-commit hook will automatically run:
- Type checking
- Linting
- Tests
- Build verification

## License

MIT
