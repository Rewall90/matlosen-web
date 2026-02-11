/**
 * Matlosen Design Token System
 * Single source of truth for all visual styling.
 * These tokens are used by Tailwind CSS config and can be imported directly.
 */

// =============================================================================
// COLORS
// =============================================================================

export const colors = {
  // Primary (Warm Teal)
  primary: {
    DEFAULT: '#2a9d8f',
    light: '#3db9aa',
    dark: '#1e7268',
    subtle: '#e8f4f2',
  },

  // Backgrounds
  background: '#fdfcfa',
  surface: {
    DEFAULT: '#f8f6f3',
    elevated: '#ffffff',
    muted: '#efedea',
  },

  // Text
  text: {
    primary: '#151b1c',
    secondary: '#4f5b5e',
    muted: '#768286',
    inverse: '#ffffff',
  },

  // Border
  border: {
    DEFAULT: '#e3e0dc',
    subtle: '#f0eeea',
  },

  // Placeholder (for phone mockups)
  placeholder: '#e5e7eb',
} as const

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const typography = {
  fontFamily: {
    sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'] as string[],
  },

  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],        // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],    // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],       // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],    // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],     // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
    '5xl': ['3rem', { lineHeight: '1.15' }],        // 48px
  },

  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const

// =============================================================================
// SPACING
// =============================================================================

export const spacing = {
  // Base spacing scale (rem)
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px - container padding
  8: '2rem',        // 32px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px - section gap
  16: '4rem',       // 64px
  20: '5rem',       // 80px - section padding
  24: '6rem',       // 96px
  32: '8rem',       // 128px - hero top padding
} as const

// =============================================================================
// LAYOUT
// =============================================================================

export const layout = {
  // Container max widths
  container: {
    xs: '20rem',    // 320px - phone mockup
    sm: '24rem',    // 384px
    md: '28rem',    // 448px
    lg: '32rem',    // 512px
    xl: '36rem',    // 576px
    '2xl': '42rem', // 672px
    '3xl': '48rem', // 768px - content width
    '4xl': '56rem', // 896px
    '5xl': '64rem', // 1024px - max page width
  },

  // Z-index scale
  zIndex: {
    base: '0',
    dropdown: '10',
    sticky: '20',
    fixed: '30',
    modal: '40',
    header: '50',
    tooltip: '60',
  },
} as const

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px - icon container
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px - app icon
  phone: '3rem',    // 48px - phone mockup outer
  phoneScreen: '2.5rem', // 40px - phone mockup screen
  full: '9999px',   // pill/button
} as const

// =============================================================================
// SHADOWS
// =============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
} as const

// =============================================================================
// TRANSITIONS
// =============================================================================

export const transitions = {
  duration: {
    fast: '150ms',
    DEFAULT: '200ms',
    slow: '300ms',
  },
  timing: {
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const

// =============================================================================
// BREAKPOINTS
// =============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// =============================================================================
// COMPONENT TOKENS
// =============================================================================

export const components = {
  // Header
  header: {
    height: '4.5rem', // 72px
    blur: 'blur(12px)',
  },

  // Button
  button: {
    paddingX: spacing[5],
    paddingY: spacing[2.5],
    borderRadius: borderRadius.full,
  },

  // Phone mockup
  phoneMockup: {
    maxWidth: layout.container.xs,
    padding: spacing[4],
    borderRadius: borderRadius.phone,
    screenBorderRadius: borderRadius.phoneScreen,
    aspectRatio: '9/19',
  },

  // Section
  section: {
    paddingY: spacing[20],
    paddingX: spacing[6],
    gap: spacing[12],
  },
} as const

// =============================================================================
// COMBINED THEME EXPORT
// =============================================================================

export const theme = {
  colors,
  typography,
  spacing,
  layout,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  components,
} as const

export type Theme = typeof theme
