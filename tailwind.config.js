/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50:  "#fdf8f0",
          100: "#faefd9",
          200: "#f3d9a8",
          300: "#eabc6b",
          400: "#e09d3a",
          500: "#d4841f",
          600: "#b86918",
          700: "#924f16",
          800: "#783f18",
          900: "#633518",
          950: "#381a09",
        },
        cream: "#fdf6ec",
        charcoal: "#1c1a18",
      },
    },
  },
  plugins: [],
};
