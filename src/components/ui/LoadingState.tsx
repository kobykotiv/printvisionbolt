import { Loader2 } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const loadingVariants = cva(
  'animate-spin text-primary',
  {
    variants: {
      size: {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
      },
      variant: {
        default: 'text-primary',
        light: 'text-primary/60',
        white: 'text-white',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export interface LoadingStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  fullscreen?: boolean;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'light' | 'white';
}

export function LoadingState({
  className,
  size,
  variant,
  fullscreen,
  text,
  ...props
}: LoadingStateProps) {
  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2',
        fullscreen && 'fixed inset-0 bg-background/80 backdrop-blur-sm',
        className
      )}
      {...props}
    >
      <Loader2 className={loadingVariants({ size, variant })} />
      {text && (
        <p className={cn(
          'text-sm',
          variant === 'white' ? 'text-white' : 'text-muted-foreground'
        )}>
          {text}
        </p>
      )}
    </div>
  );

  return fullscreen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {content}
    </div>
  ) : content;
}

// Loading states for common scenarios
export function TableLoadingState() {
  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <LoadingState text="Loading data..." />
    </div>
  );
}

export function ButtonLoadingState() {
  return <LoadingState size="sm" className="mr-2" />;
}

export function PageLoadingState() {
  return (
    <LoadingState 
      fullscreen 
      size="lg" 
      text="Loading..." 
      className="p-4"
    />
  );
}