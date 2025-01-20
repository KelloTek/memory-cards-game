/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{html,js}",
    "./dist/*.js"
  ],
  theme: {
    extend: {
      colors: {
        "custom-black": "#1f1f1f",
        "custom-blue": "#38bdf8",
      },
    },
  },
  plugins: [],
}