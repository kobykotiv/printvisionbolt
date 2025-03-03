<<<<<<< HEAD
import { useEffect } from 'react'
=======
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
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
