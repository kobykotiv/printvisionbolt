import { NavLink } from 'react-router-dom'
import { useTierLimits } from '@/hooks/useTierLimits'
import { 
  Home as HomeIcon, 
  Layout as TemplateIcon, 
  FileSymlink as BlueprintIcon,
  Image as AssetIcon,
  PenTool as DesignIcon,
  FolderTree as CollectionIcon,
  RefreshCw as SyncIcon,
  Calendar as DropIcon,
  BarChart as ChartIcon,
  Settings as SettingsIcon
} from 'lucide-react'

export function Sidebar() {
  const { canAccessFeature } = useTierLimits()

  const navigationItems = [
    {
      label: 'Dashboard',
      icon: HomeIcon,
      href: '/dashboard',
      available: true
    },
    {
      label: 'Templates',
      icon: TemplateIcon,
      href: '/templates',
      available: true
    },
    {
      label: 'Blueprints',
      icon: BlueprintIcon,
      href: '/blueprints',
      available: true
    },
    {
      label: 'Assets',
      icon: AssetIcon,
      href: '/assets',
      available: true
    },
    {
      label: 'Designs',
      icon: DesignIcon,
      href: '/designs',
      available: true
    },
    {
      label: 'Collections',
      icon: CollectionIcon,
      href: '/collections',
      available: canAccessFeature('collections')
    },
    {
      label: 'Sync',
      icon: SyncIcon,
      href: '/sync',
      available: canAccessFeature('sync')
    },
    {
      label: 'Drops',
      icon: DropIcon,
      href: '/drops',
      available: canAccessFeature('drops')
    },
    {
      label: 'Analytics',
      icon: ChartIcon,
      href: '/analytics',
      available: canAccessFeature('analytics')
    },
    {
      label: 'Settings',
      icon: SettingsIcon,
      href: '/settings',
      available: true
    }
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-2">
        {navigationItems.map(item => (
          item.available && (
            <NavItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
            />
          )
        ))}
      </nav>
    </aside>
  )
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
}

function NavItem({ icon: Icon, label, href }: NavItemProps) {
  return (
    <NavLink 
      to={href}
      className={({ isActive }) => 
        `flex items-center px-4 py-2 rounded-md transition-colors ${
          isActive 
            ? 'bg-blue-100 text-blue-700' 
            : 'text-gray-700 hover:bg-gray-100'
        }`
      }
    >
      <Icon className="w-5 h-5 mr-3" />
      <span>{label}</span>
    </NavLink>
  )
}
