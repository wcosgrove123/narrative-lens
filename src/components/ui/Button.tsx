import React from 'react';
import { colors, transitions, components, shadows } from '../../styles/design-tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'base' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: colors.brand.blue,
    color: colors.text.primary,
    border: 'none',
  },
  secondary: {
    backgroundColor: colors.bg.surface,
    color: colors.text.secondary,
    border: `1px solid ${colors.border.default}`,
  },
  ghost: {
    backgroundColor: 'transparent',
    color: colors.text.tertiary,
    border: 'none',
  },
  danger: {
    backgroundColor: colors.semantic.error,
    color: colors.text.primary,
    border: 'none',
  },
};

const variantHoverStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: colors.brand.blueHover,
    transform: 'translateY(-1px)',
    boxShadow: shadows.md,
  },
  secondary: {
    backgroundColor: colors.bg.subtle,
    borderColor: colors.border.strong,
  },
  ghost: {
    backgroundColor: colors.bg.surface,
    color: colors.text.secondary,
  },
  danger: {
    backgroundColor: '#DC2626', // Darker red
    transform: 'translateY(-1px)',
    boxShadow: shadows.md,
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    height: components.button.height.sm,
    padding: components.button.padding.sm,
    fontSize: '0.875rem',
  },
  base: {
    height: components.button.height.base,
    padding: components.button.padding.base,
    fontSize: '1rem',
  },
  lg: {
    height: components.button.height.lg,
    padding: components.button.padding.lg,
    fontSize: '1.125rem',
  },
};

export function Button({
  variant = 'primary',
  size = 'base',
  children,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled = false,
  className = '',
  style = {},
  onMouseEnter,
  onMouseLeave,
  ...props
}: ButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: 500,
    borderRadius: '0.5rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: `all ${transitions.duration.base} ${transitions.timing.smooth}`,
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.5 : 1,
    outline: 'none',
    userSelect: 'none',
    ...sizeStyles[size],
    ...variantStyles[variant],
    ...(isHovered && !disabled ? variantHoverStyles[variant] : {}),
    ...style,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(true);
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(false);
    onMouseLeave?.(e);
  };

  return (
    <button
      className={className}
      style={baseStyle}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {leftIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{leftIcon}</span>}
      {children}
      {rightIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{rightIcon}</span>}
    </button>
  );
}

/**
 * IconButton - Square button optimized for icons only
 */
export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export function IconButton({
  icon,
  size = 'base',
  variant = 'ghost',
  className = '',
  style = {},
  ...props
}: IconButtonProps) {
  const iconSizes = {
    sm: '2rem',
    base: '2.5rem',
    lg: '3rem',
  };

  const iconButtonStyle: React.CSSProperties = {
    padding: 0,
    width: iconSizes[size],
    height: iconSizes[size],
    ...style,
  };

  return (
    <Button variant={variant} size={size} className={className} style={iconButtonStyle} {...props}>
      {icon}
    </Button>
  );
}
