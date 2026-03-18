/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef9ec',
          100: '#fdf2d9',
          200: '#fbe5b3',
          300: '#f9d88d',
          400: '#f7cb67',
          500: '#DAA737',
          600: '#c4952f',
          700: '#a37d27',
          800: '#82641f',
          900: '#614b17',
        },
        gold: {
          400: '#f7cb67',
          500: '#DAA737',
          600: '#c4952f',
        }
      },
    },
  },
  plugins: [],
}