/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          950: '#09090b',
          900: '#111113',
          850: '#161618',
          800: '#1c1c1f',
          700: '#27272a',
          600: '#3f3f46',
        },
        accent: {
          DEFAULT: '#6366f1',
          hover: '#818cf8',
          dim: '#4f46e5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
