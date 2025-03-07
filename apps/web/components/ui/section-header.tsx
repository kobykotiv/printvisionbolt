interface SectionHeaderProps {
  title: string
  description?: string
  centered?: boolean
  className?: string
}

import { cn } from '@/lib/utils'

export function SectionHeader({
  title,
  description,
  centered = false,
  className
}: SectionHeaderProps) {
  return (
    <div 
      className={cn(
        centered && "text-center",
        "max-w-3xl",
        centered && "mx-auto",
        "mb-16",
        className
      )}
    >
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-xl text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}