import { useEffect } from 'react'
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
