/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ffffff',    // 60%
        secondary: '#262626',  // 30%
        accent: '#01BFFB',     // 10%
      }
    },
  },
  plugins: [],
};