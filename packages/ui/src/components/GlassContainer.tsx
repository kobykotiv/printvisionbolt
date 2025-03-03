import React from 'react';
<<<<<<< HEAD
import type { GlassProps } from '../hooks/types';
=======
import { createGlassStyle, glassReflection, glassAccent } from '../styles/glass';
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)

export interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  opacity?: number;
  blur?: number;
  border?: boolean;
  dark?: boolean;
  accentColor?: string;
  className?: string;
<<<<<<< HEAD
  performance?: 'high' | 'medium' | 'low';
=======
  style?: React.CSSProperties;
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
}

export const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
<<<<<<< HEAD
  opacity = 0.8,
  blur = 8,
  border = true,
  dark = false,
  accentColor,
  className = '',
  performance = 'high',
  style,
  ...props
}) => {
  const containerStyle: React.CSSProperties = {
    backgroundColor: dark ? 'rgba(15, 23, 42, 0.8)' : `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${blur}px)`,
    border: border ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
    borderRadius: '8px',
    padding: '16px',
    position: 'relative',
    overflow: 'hidden',
    ...style
  };

  const reflectionStyle: React.CSSProperties = performance === 'high' ? {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-50%',
    width: '200%',
    height: '100%',
    background: `linear-gradient(
      to right,
      transparent,
      ${accentColor ? `rgba(${accentColor}, 0.1)` : 'rgba(255, 255, 255, 0.1)'},
      transparent
    )`,
    transform: 'rotate(30deg)',
    pointerEvents: 'none'
  } : {};

=======
  opacity,
  blur,
  border,
  dark,
  accentColor,
  className = '',
  style = {},
  ...props
}) => {
  const glassStyle = createGlassStyle({ opacity, blur, border, dark });
  const containerStyle = {
    ...glassStyle,
    ...glassReflection,
    ...(accentColor ? glassAccent(accentColor) : {}),
    ...style,
  };

>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
  return (
    <div 
      className={`glass-container ${className}`}
      style={containerStyle}
      {...props}
    >
<<<<<<< HEAD
      {performance === 'high' && (
        <div
          style={reflectionStyle}
          aria-hidden="true"
          className="glass-reflection"
        />
      )}
=======
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
      {children}
    </div>
  );
};

export default GlassContainer;