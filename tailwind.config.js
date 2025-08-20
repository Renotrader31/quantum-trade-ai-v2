/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors for the trading app
        'trading-bg': '#0a0a0a',
        'trading-card': '#1a1a1a',
        'trading-border': '#333333',
      }
    },
  },
  plugins: [],
}