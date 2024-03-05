/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-select/dist/index.esm.js",
  ],
  theme: {
    fontWeight: {
      thin: "100",
      hairline: "100",
      extralight: "200",
      light: "300",
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
      extrabold: "800",
      "extra-bold": "800",
      black: "900",
    },
    extend: {
      fontFamily: {
        Montserrat: ["Montserrat", ...defaultTheme.fontFamily.sans],
      },
      transitionProperty: {
        height: "height",
      },
      zIndex: {
        100: "100",
      },
      screens: {
        print: { raw: "print" },
        screen: { raw: "screen" },
      },
      animation: {
        "infinite-scroll": "infinite-scroll 300s linear infinite",
      },
      keyframes: {
        "infinite-scroll": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
    require("tailwind-scrollbar-hide"),
    require("@shrutibalasa/tailwind-grid-auto-fit"),
  ],
};

// backgroundImage: {
//   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
//   "gradient-conic":
//     "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
// },
