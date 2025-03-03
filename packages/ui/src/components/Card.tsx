import React from 'react';
import GlassContainer, { GlassContainerProps } from './GlassContainer';

export interface CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  padding?: string | number;
  className?: string;
  children?: React.ReactNode;
  // Glass properties
  opacity?: number;
  blur?: number;
  border?: boolean;
  dark?: boolean;
  accentColor?: string;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  actions,
  children,
  padding = '1.5rem',
  className = '',
  // Glass properties
  opacity,
  blur,
  border,
  dark,
  accentColor,
  style,
  ...props
}) => {
  const headerStyle: React.CSSProperties = {
    marginBottom: subtitle ? '0.5rem' : '1rem',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'inherit',
    margin: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: 'inherit',
    opacity: 0.7,
    margin: '0.25rem 0 0 0',
  };

  const contentStyle: React.CSSProperties = {
    padding,
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    marginTop: '1rem',
  };

  return (
    <GlassContainer 
      className={`card ${className}`}
      opacity={opacity}
      blur={blur}
      border={border}
      dark={dark}
      accentColor={accentColor}
      style={style}
      {...props}
    >
      <div style={contentStyle}>
        {(title || subtitle) && (
          <div style={headerStyle}>
            {title && <h3 style={titleStyle}>{title}</h3>}
            {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
          </div>
        )}
        {children}
        {actions && <div style={actionsStyle}>{actions}</div>}
      </div>
    </GlassContainer>
  );
};

export default Card;