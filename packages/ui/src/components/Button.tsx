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

export default Button;