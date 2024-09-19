/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        rgPrimary: '#EB8EBA',
        rgHighlight: '#F799CA',
        rgHighlightHover: '#ffa8d2',
        rgFontColor: '#ea8db9'
      },
      fontFamily: {
        'century': ['Century Gothic', 'sans-serif'],
        'century-bold': ['Century Gothic Bold', 'sans-serif'],
        'dinar': ['GE Dinar One Medium', 'sans-serif'],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          "base-content": '#ea8db9',
          "primary": '#EB8EBA',
          "base-100": '#fff',
        },
      },
    ],
    darkTheme: "light",
  },
};