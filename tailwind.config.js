/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-primary-50','bg-primary-100','bg-primary-600','bg-primary-700','bg-primary-800','bg-primary-900',
    'text-primary-400','text-primary-500','text-primary-600','text-primary-700',
    'bg-gold-50','bg-gold-100','bg-gold-500','bg-gold-600',
    'text-gold-400','text-gold-500','text-gold-600','text-gold-700',
    'bg-green-50','bg-green-100','text-green-600',
    'bg-purple-50','text-purple-600',
    'border-primary-200','border-primary-400','border-primary-500',
    'shadow-primary-600/20','shadow-primary-600/30','shadow-gold-500/20','shadow-gold-500/30',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#1e3270',
        },
        gold: {
          50:  '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#DAA737',
          600: '#ca8a04',
          700: '#a16207',
        },
      },
    },
  },
  plugins: [],
}
