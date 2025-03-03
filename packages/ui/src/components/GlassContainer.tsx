import React from 'react';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import type { GlassProps } from '../hooks/types';
=======
import { createGlassStyle, glassReflection, glassAccent } from '../styles/glass';
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
=======
import type { GlassProps } from '../hooks/types';
>>>>>>> c34d7d5 (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)
=======
import { createGlassStyle, glassReflection, glassAccent } from '../styles/glass';
>>>>>>> dc00547 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)

export interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  opacity?: number;
  blur?: number;
  border?: boolean;
  dark?: boolean;
  accentColor?: string;
  className?: string;
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
  performance?: 'high' | 'medium' | 'low';
=======
  style?: React.CSSProperties;
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
=======
  performance?: 'high' | 'medium' | 'low';
>>>>>>> c34d7d5 (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)
=======
  style?: React.CSSProperties;
>>>>>>> dc00547 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
}

export const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> c34d7d5 (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)
  opacity = 0.8,
  blur = 8,
  border = true,
  dark = false,
<<<<<<< HEAD
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
=======
>>>>>>> dc00547 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
  opacity,
  blur,
  border,
  dark,
<<<<<<< HEAD
=======
>>>>>>> c34d7d5 (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)
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

<<<<<<< HEAD
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
=======
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

>>>>>>> c34d7d5 (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)
=======
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

>>>>>>> dc00547 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
  return (
    <div 
      className={`glass-container ${className}`}
      style={containerStyle}
      {...props}
    >
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> c34d7d5 (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)
      {performance === 'high' && (
        <div
          style={reflectionStyle}
          aria-hidden="true"
          className="glass-reflection"
        />
      )}
<<<<<<< HEAD
=======
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
=======
>>>>>>> c34d7d5 (feat: Add TypeScript configuration files, enhance testing setup, and update documentation for API integration)
=======
>>>>>>> dc00547 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
      {children}
    </div>
  );
};

export default GlassContainer;