import React from 'react';
import { colors, transitions, components, shadows } from '../../styles/design-tokens';

export type InputSize = 'sm' | 'base' | 'lg';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: InputSize;
  error?: boolean;
  helperText?: string;
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const sizeStyles: Record<InputSize, React.CSSProperties> = {
  sm: {
    height: components.input.height.sm,
    padding: components.input.padding.sm,
    fontSize: '0.875rem',
  },
  base: {
    height: components.input.height.base,
    padding: components.input.padding.base,
    fontSize: '1rem',
  },
  lg: {
    height: components.input.height.lg,
    padding: components.input.padding.lg,
    fontSize: '1.125rem',
  },
};

export function Input({
  size = 'base',
  error = false,
  helperText,
  label,
  leftIcon,
  rightIcon,
  className = '',
  style = {},
  id,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const inputId = id || `input-${React.useId()}`;

  const baseInputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: colors.bg.surface,
    color: colors.text.primary,
    border: `2px solid ${error ? colors.semantic.error : colors.border.default}`,
    borderRadius: '0.5rem',
    outline: 'none',
    transition: `all ${transitions.duration.base} ${transitions.timing.smooth}`,
    fontFamily: 'inherit',
    ...sizeStyles[size],
    ...(isFocused && !error && {
      borderColor: colors.brand.blue,
      boxShadow: `0 0 0 3px ${colors.brand.blueMuted}`,
    }),
    ...style,
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: colors.text.secondary,
  };

  const helperTextStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: error ? colors.semantic.error : colors.text.tertiary,
  };

  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const iconStyle: React.CSSProperties = {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    color: colors.text.tertiary,
    pointerEvents: 'none',
  };

  const leftIconStyle: React.CSSProperties = {
    ...iconStyle,
    left: '0.75rem',
  };

  const rightIconStyle: React.CSSProperties = {
    ...iconStyle,
    right: '0.75rem',
  };

  // Adjust padding when icons are present
  const inputPaddingStyle: React.CSSProperties = {
    ...(leftIcon && { paddingLeft: '2.5rem' }),
    ...(rightIcon && { paddingRight: '2.5rem' }),
  };

  return (
    <div style={containerStyle}>
      {label && (
        <label htmlFor={inputId} style={labelStyle}>
          {label}
        </label>
      )}
      <div style={inputWrapperStyle}>
        {leftIcon && <span style={leftIconStyle}>{leftIcon}</span>}
        <input
          id={inputId}
          className={className}
          style={{ ...baseInputStyle, ...inputPaddingStyle }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {rightIcon && <span style={rightIconStyle}>{rightIcon}</span>}
      </div>
      {helperText && <span style={helperTextStyle}>{helperText}</span>}
    </div>
  );
}

/**
 * Textarea component with same design system
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: InputSize;
  error?: boolean;
  helperText?: string;
  label?: string;
}

export function Textarea({
  size = 'base',
  error = false,
  helperText,
  label,
  className = '',
  style = {},
  id,
  ...props
}: TextareaProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const textareaId = id || `textarea-${React.useId()}`;

  const baseTextareaStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: colors.bg.surface,
    color: colors.text.primary,
    border: `2px solid ${error ? colors.semantic.error : colors.border.default}`,
    borderRadius: '0.5rem',
    outline: 'none',
    transition: `all ${transitions.duration.base} ${transitions.timing.smooth}`,
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: '6rem',
    padding: components.input.padding[size],
    fontSize: sizeStyles[size].fontSize,
    ...(isFocused && !error && {
      borderColor: colors.brand.blue,
      boxShadow: `0 0 0 3px ${colors.brand.blueMuted}`,
    }),
    ...style,
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: colors.text.secondary,
  };

  const helperTextStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: error ? colors.semantic.error : colors.text.tertiary,
  };

  return (
    <div style={containerStyle}>
      {label && (
        <label htmlFor={textareaId} style={labelStyle}>
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={className}
        style={baseTextareaStyle}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {helperText && <span style={helperTextStyle}>{helperText}</span>}
    </div>
  );
}
