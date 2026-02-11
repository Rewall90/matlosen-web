import type { Config } from 'tailwindcss'
import { colors, typography, spacing, layout, borderRadius, shadows } from './lib/theme'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        background: colors.background,
        surface: colors.surface,
        text: colors.text,
        border: colors.border,
        placeholder: colors.placeholder,
      },
      fontFamily: typography.fontFamily,
      spacing: {
        'section': spacing[20],
        'section-sm': spacing[16],
        'container': spacing[6],
        'hero-top': spacing[32],
      },
      maxWidth: {
        'page': layout.container['5xl'],
        'content': layout.container['3xl'],
        'phone': layout.container.xs,
      },
      borderRadius: {
        'xl': borderRadius.xl,
        '2xl': borderRadius['2xl'],
        '3xl': borderRadius['3xl'],
        'phone': borderRadius.phone,
        'phone-screen': borderRadius.phoneScreen,
      },
      zIndex: {
        'header': layout.zIndex.header,
      },
      boxShadow: shadows,
    },
  },
  plugins: [],
}

export default config
