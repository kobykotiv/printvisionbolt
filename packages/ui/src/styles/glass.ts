interface GlassStyleProps {
  opacity?: number;
  blur?: number;
  border?: boolean;
  dark?: boolean;
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