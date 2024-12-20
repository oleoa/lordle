/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        black: "#0B3C49",
        white: "#fffBff",
        purple: "#a100f2",
        blue: "#0d00a4",
        gray: "#595959",
        yellow: "#FFC857",
        green: "#4DAA57",
      },
    },
  },
  plugins: [],
};
