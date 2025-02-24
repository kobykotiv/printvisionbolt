import React from 'react';

export interface CustomCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

const shadowStyles = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg'
};

export const Card = React.forwardRef<HTMLDivElement, CustomCardProps>(
  ({ hoverable = false, shadow = 'sm', className = '', children, ...props }, ref) => {
    const baseStyles = 'bg-white rounded-lg border border-gray-200';
    const hoverStyles = hoverable ? 'transition-all duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer' : '';
    
    return (
      <div
        ref={ref}
        className={`${baseStyles} ${shadowStyles[shadow]} ${hoverStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
