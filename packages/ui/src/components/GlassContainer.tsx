import React from 'react';
import { createGlassStyle, glassReflection, glassAccent } from '../styles/glass';

export interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  opacity?: number;
  blur?: number;
  border?: boolean;
  dark?: boolean;
  accentColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
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

  return (
    <div 
      className={`glass-container ${className}`}
      style={containerStyle}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassContainer;