/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm off-white / neutral background
        'neutral-50': '#fafaf8',
        'neutral-100': '#f5f5f2',
        'neutral-200': '#ebe8e3',
        'neutral-300': '#ddd9d0',
        'neutral-400': '#ccc5b9',
        'neutral-500': '#9e9890',
        'neutral-600': '#6b6560',
        'neutral-700': '#3d3935',
        'neutral-800': '#2b2824',
        'neutral-900': '#1a1714',
        
        // Primary accent - energetic yet trustworthy
        'accent-50': '#f0f9ff',
        'accent-100': '#e0f2fe',
        'accent-200': '#bae6fd',
        'accent-300': '#7dd3fc',
        'accent-400': '#38bdf8',
        'accent-500': '#0ea5e9',
        'accent-600': '#0284c7',
        'accent-700': '#0369a1',
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '44px' }],
        '5xl': ['48px', { lineHeight: '56px' }],
        '6xl': ['60px', { lineHeight: '72px' }],
      },
      spacing: {
        'safe': 'max(1rem, env(safe-area-inset-bottom))',
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 300ms ease-out',
        'slide-up': 'slide-up 400ms cubic-bezier(0.33, 0.66, 0.66, 1)',
        'scale-in': 'scale-in 300ms cubic-bezier(0.33, 0.66, 0.66, 1)',
        'bounce-soft': 'bounce-soft 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        'slide-up': {
          'from': { transform: 'translateY(16px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        'scale-in': {
          'from': { transform: 'scale(0.95)', opacity: '0' },
          'to': { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      transitionDuration: {
        '300': '300ms',
        '400': '400ms',
        '600': '600ms',
        '700': '700ms',
        '1000': '1000ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
