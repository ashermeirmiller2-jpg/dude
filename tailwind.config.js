/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'aramaic': ['"Frank Ruhl Libre"', 'serif'],
      },
    },
  },
  plugins: [],
}

