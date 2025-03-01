# Project Structure

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

## Key Technologies

Our tech stack leverages modern, production-proven technologies to build a scalable and maintainable application:

- **Next.js 13+ with App Router**
  - A powerful React framework for production-grade applications
  - App Router provides server-side rendering, static generation, and client-side navigation
  - Built-in performance optimizations and automatic code splitting
  - [Learn more about Next.js](https://nextjs.org/docs)

- **TypeScript 5.0+**
  - A typed superset of JavaScript that enhances code quality and maintainability
  - Provides better IDE support, early error detection, and improved refactoring capabilities
  - Latest version includes advanced type features and performance improvements
  - [Learn more about TypeScript](https://www.typescriptlang.org/docs/)

- **Supabase (Self-hosted)**
  - Self-hosted PostgreSQL database and authentication
  - Real-time subscriptions and edge functions
  - Built-in row level security for robust data protection
  - Scales vertically with your VPS for enhanced performance
  - [Learn more about Supabase](https://supabase.com/docs)

- **Glassomorphic UI System**
  - Custom-built component library with glassomorphism design
  - Customizable gradient accents
  - Built-in support for light/dark modes
  - Focus on accessibility and performance
  - Responsive and mobile-first design patterns

- **tRPC**
  - End-to-end typesafe APIs with TypeScript
  - Eliminates the need for manual API documentation and type definitions
  - Provides excellent developer experience with automatic type inference
  - [Learn more about tRPC](https://trpc.io/docs)

- **Bun**
  - All-in-one JavaScript runtime and toolkit
  - Built-in package manager
  - Incredibly fast test runner
  - Native TypeScript support
  - [Learn more about Bun](https://bun.sh/docs)

- **PowerShell Automation**
  - Windows-optimized scripting and automation
  - Integrated development workflows
  - Deployment automation
  - Environment management

Each technology was chosen for its specific strengths and how it complements the overall architecture:

- Strong typing and static analysis (TypeScript + tRPC)
- Robust frontend performance (Next.js + Glassomorphic UI)
- Scalable backend infrastructure (Self-hosted Supabase)
- High-performance development (Bun runtime and tooling)
- Windows-optimized automation (PowerShell)

This stack enables us to build a scalable, maintainable, and performant application while maintaining excellent developer experience and code quality.
