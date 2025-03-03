<<<<<<< HEAD
import type { CSSProperties } from 'react';

interface GlassStyleOptions {
=======
interface GlassStyleProps {
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
  opacity?: number;
  blur?: number;
  border?: boolean;
  dark?: boolean;
<<<<<<< HEAD
  performance?: 'high' | 'medium' | 'low';
}

export function createGlassStyle({
  opacity = 0.8,
  blur = 8,
  border = true,
  dark = false,
  performance = 'high'
}: GlassStyleOptions): CSSProperties {
  const baseStyles: CSSProperties = {
    backgroundColor: dark 
      ? `rgba(15, 23, 42, ${opacity})`
      : `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: performance === 'low' ? undefined : `blur(${blur}px)`,
    border: border ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
    borderRadius: '8px',
    padding: '16px',
    position: 'relative',
    overflow: 'hidden'
  };

  return baseStyles;
}

export const glassReflectionBase: CSSProperties = {
  position: 'relative',
  overflow: 'hidden'
};

export const glassReflectionPseudo: CSSProperties = {
  content: '""',
  position: 'absolute',
  top: 0,
  left: '-50%',
  width: '200%',
  height: '100%',
  transform: 'rotate(30deg)',
  pointerEvents: 'none'
};

export function glassAccent(color: string): CSSProperties {
  return {
    background: `linear-gradient(
      to right,
      transparent,
      rgba(${color}, 0.1),
      transparent
    )`
  };
}
=======
}

export const createGlassStyle = ({
  opacity = 0.7,
  blur = 10,
  border = true,
  dark = false,
}: GlassStyleProps = {}) => {
  return {
    background: dark 
      ? `rgba(17, 25, 40, ${opacity})`
      : `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    boxShadow: dark 
      ? '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      : '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    border: border ? `1px solid ${dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.18)'}` : 'none',
    borderRadius: '10px',
  };
};

export const glassAccent = (color: string, opacity = 0.1) => ({
  background: `linear-gradient(135deg, ${color}${Math.round(opacity * 255).toString(16)} 0%, transparent 100%)`,
});

export const glassReflection = {
  position: 'relative' as const,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)',
    pointerEvents: 'none',
  },
};
>>>>>>> f0eefa9 (feat: Refactor project structure by removing pnpm workspace file, updating dependencies, and adding API types)
