import { UserMenu } from './UserMenu'
import { TierBadge } from '../badges/TierBadge'
import { NotificationsMenu } from './NotificationsMenu'

export function Header() {
  const { user } = useAuth()
  
  return (
    <header className="h-16 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 h-full">
        <div className="flex items-center gap-4">
          <Logo />
          <TierBadge tier={user?.tier} />
        </div>
        
        <div className="flex items-center gap-4">
          <NotificationsMenu />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
