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

- **Supabase**
  - An open-source alternative to Firebase
  - Provides PostgreSQL database, authentication, real-time subscriptions, and edge functions
  - Built-in row level security for robust data protection
  - [Learn more about Supabase](https://supabase.com/docs)

- **Chakra UI**
  - A modular and accessible component library for React applications
  - Built-in support for light/dark modes and customizable theming
  - Focus on developer experience and accessibility
  - [Learn more about Chakra UI](https://chakra-ui.com/docs/getting-started)

- **tRPC**
  - End-to-end typesafe APIs with TypeScript
  - Eliminates the need for manual API documentation and type definitions
  - Provides excellent developer experience with automatic type inference
  - [Learn more about tRPC](https://trpc.io/docs)

- **Prisma ORM**
    - Next-generation Node.js and TypeScript ORM
    - Type-safe database access with auto-generated queries
    - Schema migrations and database management tools
    - [Learn more about Prisma](https://www.prisma.io/docs)

- **Supabase**
    - An open-source alternative to Firebase
    - Provides PostgreSQL database, authentication, real-time subscriptions, and edge functions
    - Built-in row level security for robust data protection
    - Scales vertically with your VPS for enhanced performance
    - [Learn more about Supabase](https://supabase.com/docs)

- **Jest & React Testing Library**
  - Jest: A comprehensive JavaScript testing framework
  - React Testing Library: Testing utilities focused on user behavior
  - Ensures reliable test coverage and maintainable test suites
  - [Jest Documentation](https://jestjs.io/docs/getting-started)
  - [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)

- **GitHub Actions**
  - Automated CI/CD pipeline platform
  - Handles testing, building, and deployment workflows
  - Integrates seamlessly with our GitHub repository
  - [Learn more about GitHub Actions](https://docs.github.com/en/actions)

Each technology was chosen for its specific strengths and how it complements the overall architecture:

- Strong typing and static analysis (TypeScript + Prisma + tRPC)
- Robust frontend performance (Next.js + Chakra UI)
- Scalable backend infrastructure (Supabase + Prisma)
- Reliable testing and deployment (Jest + GitHub Actions)

This stack enables us to build a scalable, maintainable, and performant application while maintaining excellent developer experience and code quality.
