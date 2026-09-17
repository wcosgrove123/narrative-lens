/**
 * Design System Tokens for Visual Narrative
 * Central source of truth for colors, typography, spacing, shadows, and animations
 */

// ============================================================================
// COLORS
// ============================================================================

export const colors = {
  // Background layers (darkest to lightest)
  bg: {
    base: '#0A0A0A',      // Deepest background
    elevated: '#121212',   // Slightly elevated surfaces
    default: '#1A1A1A',    // Default canvas/body background
    surface: '#222222',    // Cards and panels
    subtle: '#2A2A2A',     // Hover states and subtle emphasis
  },

  // Foreground/borders
  border: {
    subtle: '#2A2A2A',
    default: '#333333',
    strong: '#404040',
    interactive: '#4B5563', // Gray-600
  },

  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#E5E5E5',
    tertiary: '#A3A3A3',
    quaternary: '#737373',
    disabled: '#525252',
  },

  // Brand colors
  brand: {
    blue: '#007AFF',
    blueHover: '#0051D5',
    blueLight: 'rgba(0, 122, 255, 0.1)',
    blueMuted: 'rgba(0, 122, 255, 0.15)',
  },

  // Semantic colors
  semantic: {
    success: '#10B981',
    successLight: 'rgba(16, 185, 129, 0.1)',
    warning: '#F59E0B',
    warningLight: 'rgba(245, 158, 11, 0.1)',
    error: '#EF4444',
    errorLight: 'rgba(239, 68, 68, 0.1)',
    info: '#3B82F6',
    infoLight: 'rgba(59, 130, 246, 0.1)',
  },

  // Special states
  overlay: {
    light: 'rgba(0, 0, 0, 0.3)',
    medium: 'rgba(0, 0, 0, 0.5)',
    heavy: 'rgba(0, 0, 0, 0.7)',
    backdrop: 'rgba(0, 0, 0, 0.6)',
    gradient: 'linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent)',
  },
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  // Font families
  fontFamily: {
    sans: "'Inter', system-ui, -apple-system, sans-serif",
    serif: "'Lora', 'Playfair Display', Georgia, serif", // For future public portfolio
  },

  // Font sizes
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
  },

  // Font weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line heights
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// ============================================================================
// SPACING
// ============================================================================

// Base unit: 4px (0.25rem)
export const spacing = {
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.4)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.5)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',

  // Special shadows
  glow: {
    blue: '0 0 0 3px rgba(0, 122, 255, 0.3)',
    blueStrong: '0 0 0 4px rgba(0, 122, 255, 0.5)',
  },
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  base: '0.375rem', // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// ============================================================================
// TRANSITIONS & ANIMATIONS
// ============================================================================

export const transitions = {
  duration: {
    fastest: '100ms',
    fast: '150ms',
    base: '200ms',
    medium: '300ms',
    slow: '400ms',
    slowest: '500ms',
  },

  timing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    // Custom cubic-bezier curves
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    snappy: 'cubic-bezier(0.4, 0, 0.6, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// ============================================================================
// Z-INDEX SCALE
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const;

// ============================================================================
// BREAKPOINTS (for future responsive design)
// ============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================================================
// COMPONENT-SPECIFIC TOKENS
// ============================================================================

export const components = {
  button: {
    height: {
      sm: '2rem',      // 32px
      base: '2.5rem',  // 40px
      lg: '3rem',      // 48px
    },
    padding: {
      sm: '0.5rem 1rem',      // 8px 16px
      base: '0.75rem 1.5rem', // 12px 24px
      lg: '1rem 2rem',        // 16px 32px
    },
  },

  card: {
    padding: {
      sm: '1rem',      // 16px
      base: '1.5rem',  // 24px
      lg: '2rem',      // 32px
    },
    aspectRatio: {
      story: '3 / 2',  // Changed from 4/3 for better proportions
    },
  },

  input: {
    height: {
      sm: '2rem',      // 32px
      base: '2.5rem',  // 40px
      lg: '3rem',      // 48px
    },
    padding: {
      sm: '0.5rem 0.75rem',
      base: '0.75rem 1rem',
      lg: '1rem 1.25rem',
    },
  },
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Creates a CSS box-shadow string for focus rings
 */
export function focusRing(color: string = colors.brand.blue, opacity: number = 0.3) {
  return `0 0 0 3px rgba(${hexToRgb(color)}, ${opacity})`;
}

/**
 * Converts hex color to RGB values
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
}

/**
 * Creates a transition string
 */
export function transition(
  properties: string[] = ['all'],
  duration: keyof typeof transitions.duration = 'base',
  timing: keyof typeof transitions.timing = 'smooth'
) {
  return properties
    .map((prop) => `${prop} ${transitions.duration[duration]} ${transitions.timing[timing]}`)
    .join(', ');
}
