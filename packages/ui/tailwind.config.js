/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        glass: {
          DEFAULT: "rgba(255, 255, 255, 0.1)",
          dark: "rgba(0, 0, 0, 0.1)",
        }
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(8px)',
      },
      backgroundImage: {
        'gradient-glass': 'linear-gradient(to bottom right, var(--glass-from, rgba(255, 255, 255, 0.2)), transparent)',
      },
      animation: {
        'glass-shimmer': 'glass-shimmer 2s linear infinite',
      },
      keyframes: {
        'glass-shimmer': {
          '0%': { 'background-position': '200% 0' },
          '100%': { 'background-position': '-200% 0' },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/forms'),
  ],
}