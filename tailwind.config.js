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
        'century': ['Century Gothic', 'sans-serif'],
        'century-bold': ['Century Gothic Bold', 'sans-serif'],
        'dinar': ['GE Dinar One Medium', 'sans-serif'],
      },
    },
  },
  plugins: [require("daisyui")],
};
