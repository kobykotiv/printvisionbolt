import { ReactNode } from 'react'
import { cn } from '../../utils'

interface Action {
  label: string
  href: string
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

interface GlassHeaderProps {
  title: string
  subtitle?: string
  actions?: Action[]
  children?: ReactNode
  className?: string
}

export function GlassHeader({
  title,
  subtitle,
  actions,
  children,
  className
}: GlassHeaderProps) {
  return (
    <div className={cn(
      'mb-6 flex items-center justify-between',
      'p-6 rounded-lg',
      'bg-white bg-opacity-30 backdrop-blur-lg backdrop-filter',
      'border border-white border-opacity-10',
      'shadow-xl',
      className
    )}>
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-gray-500">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3">
          {actions.map((action, i) => (
            <a
              key={i}
              href={action.href}
              onClick={action.onClick}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium',
                'transition-colors duration-200',
                action.variant === 'primary' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {action.label}
            </a>
          ))}
        </div>
      )}
      {children}
    </div>
  )
}
