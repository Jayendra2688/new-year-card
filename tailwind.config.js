/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        greeting: ["'Dancing Script'", "cursive"],
        mordern:["'Poppins'", "sans-serif"],   
        labels:["'Roboto'","sans-serif"] 
      },
    },
  },
  plugins: [],
}
