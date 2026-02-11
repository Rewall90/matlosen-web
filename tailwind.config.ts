import type { Config } from 'tailwindcss'
import {
  colors,
  opacity,
  typography,
  semanticSpacing,
  layout,
  borderRadius,
  shadows,
  transitions,
  blur,
  componentSizes,
} from './lib/theme'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Colors
      colors: {
        primary: colors.primary,
        background: colors.background,
        surface: colors.surface,
        text: colors.text,
        border: colors.border,
        placeholder: colors.placeholder,
      },

      // Opacity
      opacity: opacity,

      // Typography
      fontFamily: typography.fontFamily,

      // Spacing - semantic tokens
      spacing: semanticSpacing,

      // Layout
      maxWidth: layout.maxWidth,
      zIndex: layout.zIndex,

      // Border radius
      borderRadius: {
        'icon': borderRadius.icon,
        'card': borderRadius.card,
        'button': borderRadius.button,
        'phone': borderRadius.phone,
        'phone-screen': borderRadius['phone-screen'],
      },

      // Shadows
      boxShadow: {
        'card': shadows.card,
        'phone': shadows.phone,
      },

      // Transitions
      transitionDuration: {
        'fast': transitions.duration.fast,
        'default': transitions.duration.DEFAULT,
        'slow': transitions.duration.slow,
      },
      transitionTimingFunction: {
        'default': transitions.timing.DEFAULT,
        'in': transitions.timing.in,
        'out': transitions.timing.out,
        'in-out': transitions.timing.inOut,
      },

      // Blur
      blur: {
        'header': blur.header,
      },

      // Component sizes
      width: componentSizes,
      height: componentSizes,
    },
  },
  plugins: [],
}

export default config
