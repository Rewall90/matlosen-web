import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2a9d8f',
          light: '#3db9aa',
          dark: '#1e7268',
        },
        background: '#fdfcfa',
        surface: '#f8f6f3',
        text: {
          primary: '#151b1c',
          secondary: '#4f5b5e',
          muted: '#768286',
        },
        border: '#e3e0dc',
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
