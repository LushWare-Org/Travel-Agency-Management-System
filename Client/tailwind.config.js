/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        'slide-in': 'slideIn 0.5s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      colors: {
        platinum: '#E7E9E5',
        ash_gray: '#B7C5C7',
        lapis_lazuli: '#005E84',
        indigo_dye: '#0A435C',
      },
    },
  },
  plugins: [],
};