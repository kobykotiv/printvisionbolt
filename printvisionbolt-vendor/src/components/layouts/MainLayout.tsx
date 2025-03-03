import { useAuth } from '@/hooks/useAuth'
import { useTierLimits } from '@/hooks/useTierLimits'
import { Sidebar } from '../navigation/Sidebar'
import { Header } from '../navigation/Header'
import { TierAlert } from '../alerts/TierAlert'

interface MainLayoutProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function MainLayout({ children, requireAuth = true }: MainLayoutProps) {
  const { user, isLoading } = useAuth()
  const { nearingLimits } = useTierLimits()

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <LoadingSpinner />
    </div>
  }

  if (requireAuth && !user) {
    return <LoginRedirect />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {nearingLimits && <TierAlert />}
          {children}
        </main>
      </div>
    </div>
  )
}
