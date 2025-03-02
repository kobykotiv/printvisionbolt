/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        glass: {
          DEFAULT: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.1)',
        }
      },
      backgroundImage: {
        'gradient-glass': 'linear-gradient(to bottom right, var(--glass-from), var(--glass-to))',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
  ],
  // Inherit from UI package
  presets: [
    require('../../packages/ui/tailwind.config.js')
  ],
}