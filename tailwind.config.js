/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6FAFF',
          100: '#CCF5FF',
          200: '#99EBFF',
          300: '#66E0FF',
          400: '#33D6FF',
          500: '#00CFFD', // Primary color
          600: '#00A6CA',
          700: '#007C98',
          800: '#005366',
          900: '#002933',
        },
        secondary: {
          50: '#F2EFFF',
          100: '#E5DFFF',
          200: '#CBC0FF',
          300: '#B0A0FF',
          400: '#9580FF',
          500: '#7B61FF', // Secondary color
          600: '#624ECC',
          700: '#4A3A99',
          800: '#312766',
          900: '#191333',
        },
        accent: {
          50: '#E6FFF4',
          100: '#CCFFE9',
          200: '#99FFD3',
          300: '#66FFBD',
          400: '#33FFA7',
          500: '#00FFA3', // Accent color
          600: '#00CC82',
          700: '#009962',
          800: '#006641',
          900: '#003321',
        },
        dark: {
          100: '#363636',
          200: '#2D2D2D',
          300: '#242424',
          400: '#1B1B1B',
          500: '#121212', // Base dark color
          600: '#0E0E0E',
          700: '#0A0A0A',
          800: '#070707',
          900: '#030303',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        'glass': '16px',
      },
    },
  },
  plugins: [],
}