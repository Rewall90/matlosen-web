/**
 * Matlosen Design Token System
 * Single source of truth for all visual styling.
 *
 * USAGE: Always use semantic tokens when creating components.
 * - Use `py-section` not `py-20`
 * - Use `max-w-page` not `max-w-5xl`
 * - Use `text-text-primary` not hardcoded colors
 * - Use `duration-default` not `duration-200`
 *
 * See CLAUDE.md for complete token usage guidelines.
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
// OPACITY
// =============================================================================

export const opacity = {
  0: '0',
  5: '0.05',
  10: '0.1',       // Subtle backgrounds (bg-primary/10)
  20: '0.2',
  30: '0.3',
  40: '0.4',
  50: '0.5',
  60: '0.6',
  70: '0.7',
  80: '0.8',       // Hover states, glass effects
  90: '0.9',
  100: '1',
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

// Base spacing scale
export const spacing = {
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
  6: '1.5rem',      // 24px
  8: '2rem',        // 32px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  32: '8rem',       // 128px
} as const

// Semantic spacing - USE THESE in components
export const semanticSpacing = {
  // Layout
  'container': spacing[6],      // Horizontal page padding (24px)
  'section': spacing[20],       // Vertical section padding (80px)
  'section-sm': spacing[16],    // Smaller section padding (64px)
  'hero-top': spacing[32],      // Hero section top padding (128px)
  'footer': spacing[8],         // Footer vertical padding (32px)

  // Content gaps
  'gap-section': spacing[12],   // Gap between section items (48px)
  'gap-content': spacing[8],    // Gap between content blocks (32px)
  'gap-items': spacing[4],      // Gap between small items (16px)
  'gap-links': spacing[6],      // Gap between inline links (24px)

  // Text rhythm
  'mb-heading': spacing[4],     // Margin below headings (16px)
  'mb-heading-lg': spacing[6],  // Margin below large headings (24px)
  'mb-body': spacing[10],       // Margin below body text (40px)
  'mb-element': spacing[8],     // Margin below UI elements (32px)

  // Component internal
  'p-card': spacing[4],         // Card padding (16px)
  'p-button-x': spacing[5],     // Button horizontal padding (20px)
  'p-button-y': spacing[2.5],   // Button vertical padding (10px)
} as const

// =============================================================================
// LAYOUT
// =============================================================================

export const layout = {
  // Container max widths - USE THESE semantic names
  maxWidth: {
    'page': '64rem',      // 1024px - max page width
    'content': '48rem',   // 768px - content width (articles, hero)
    'narrow': '36rem',    // 576px - narrow content
    'phone': '20rem',     // 320px - phone mockup width
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
  sm: '0.125rem',       // 2px
  DEFAULT: '0.25rem',   // 4px
  md: '0.375rem',       // 6px
  lg: '0.5rem',         // 8px
  xl: '0.75rem',        // 12px
  '2xl': '1rem',        // 16px
  '3xl': '1.5rem',      // 24px

  // Semantic radius
  'icon': '0.75rem',          // Icon containers (12px)
  'card': '1rem',             // Cards (16px)
  'button': '9999px',         // Pill buttons
  'phone': '3rem',            // Phone mockup outer (48px)
  'phone-screen': '2.5rem',   // Phone mockup screen (40px)
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

  // Semantic shadows
  'card': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  'phone': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
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
// BLUR
// =============================================================================

export const blur = {
  none: '0',
  sm: '4px',
  DEFAULT: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',

  // Semantic blur
  'header': '12px',   // Header backdrop blur
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
// COMPONENT SIZES
// =============================================================================

export const componentSizes = {
  // Icon containers
  'icon-sm': '2.5rem',    // 40px
  'icon-md': '3rem',      // 48px
  'icon-lg': '6rem',      // 96px - hero app icon

  // Logo
  'logo': '2.5rem',       // 40px - header logo
} as const

// =============================================================================
// COMBINED THEME EXPORT
// =============================================================================

export const theme = {
  colors,
  opacity,
  typography,
  spacing,
  semanticSpacing,
  layout,
  borderRadius,
  shadows,
  transitions,
  blur,
  breakpoints,
  componentSizes,
} as const

export type Theme = typeof theme
