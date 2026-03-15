/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'slate-dark': '#0f172a',
        'slate-darker': '#020617',
        'emerald': '#10b981',
        'emerald-dark': '#059669',
        'blue-dark': '#1e40af',
        'blue-light': '#3b82f6'
      }
    },
  },
  plugins: [],
}
