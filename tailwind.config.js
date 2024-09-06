/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        didactGothic: ["Didact Gothic", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
};
