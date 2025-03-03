<<<<<<< HEAD
import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center rounded font-medium transition-all duration-200';
    
    const variantStyles = {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
      secondary: 'bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white',
      ghost: 'hover:bg-white/10 text-white'
    };
    
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };
    
    const loadingStyles = isLoading ? 'opacity-70 cursor-not-allowed' : '';
    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';
    
    return (
      <button
        ref={ref}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${loadingStyles}
          ${disabledStyles}
          ${className}
        `}
        disabled={disabled || isLoading}
        {...props}
      >
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        
        {isLoading ? (
          <div className="flex items-center">
            <svg
              className="animate-spin h-4 w-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {children}
          </div>
        ) : (
          children
        )}
        
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
=======
import React from 'react';
import { createGlassStyle, glassAccent } from '../styles/glass';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  accentColor?: string;
  glass?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  accentColor,
  glass = true,
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    border: 'none',
    borderRadius: '8px',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease-in-out',
    opacity: disabled || loading ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    fontWeight: 500,
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    small: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    medium: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    large: { padding: '1rem 2rem', fontSize: '1.125rem' },
  };

  const getVariantStyles = (): React.CSSProperties => {
    const glassStyles = glass ? createGlassStyle({ opacity: 0.8, blur: 8 }) : {};
    
    switch (variant) {
      case 'primary':
        return {
          ...glassStyles,
          background: accentColor || '#3B82F6',
          color: '#ffffff',
          ...(accentColor && glassAccent(accentColor, 0.2)),
        };
      case 'secondary':
        return {
          ...glassStyles,
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'inherit',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: 'inherit',
        };
      default:
        return {};
    }
  };

  const buttonStyles = {
    ...baseStyles,
    ...sizeStyles[size],
    ...getVariantStyles(),
    ...style,
  };

  const hoverClass = variant === 'ghost' ? 'hover:bg-white/10' : '';

  return (
    <button
      className={`glass-button ${variant} ${hoverClass} ${className}`}
      style={buttonStyles}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="loading-spinner" />
      ) : (
        children
      )}
    </button>
  );
};
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)

export default Button;