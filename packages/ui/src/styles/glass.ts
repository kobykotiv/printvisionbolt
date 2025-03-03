import type { CSSProperties } from 'react';

interface GlassStyleOptions {
  opacity?: number;
  blur?: number;
  border?: boolean;
  dark?: boolean;
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