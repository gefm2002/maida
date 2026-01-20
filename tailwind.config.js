/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mint: '#9ECBC3',
        'mint-dark': '#6FA8A0',
        petrol: '#2F4F5A',
        'light-gray': '#F2F2F2',
        brand: '#81BAB4',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(47, 79, 90, 0.12)',
      },
    },
  },
  plugins: [],
}

