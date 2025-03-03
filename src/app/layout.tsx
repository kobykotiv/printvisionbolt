<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { useEffect } from 'react'
=======
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
=======
import { useEffect } from 'react'
>>>>>>> c34d7d5 (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)
=======
>>>>>>> dc00547 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
import { initPostHog } from '@/lib/analytics/posthog'

// ...existing code...

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Initialize PostHog on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initPostHog()
    }
  }, [])

  return (
    // ...existing code...
  )
}
