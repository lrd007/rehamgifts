/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        rgPrimary: '#ed1974',
        rgHighlight: '#F0428E',
        rgHighlightHover: '#F46FA9'
      },
      fontFamily: {
        didactGothic: ["Didact Gothic", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
};
