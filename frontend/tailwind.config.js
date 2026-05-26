const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    letterSpacing: {
      widest: "1em",
    },
    backgroundColor: (theme) => ({
      ...theme("colors"),
      primary: "#5A6BFF",
      tertiary: "#F85900",
      orange: "#F85900",
      highlight: "#E4EAFB",
      crown: "#F8C100",
    }),
    textColor: (theme) => ({
      ...theme("colors"),
      primary: "#5A6BFF",
      tertiary: "#F85900",
    }),
    borderColor: (theme) => ({
      ...theme("colors"),
      primary: "#5A6BFF",
      tertiary: "#F85900",
    }),
    borderWidth: {
      DEFAULT: "1px",
      0: "0",
      2: "2px",
      3: "3px",
      4: "4px",
      6: "6px",
      8: "8px",
    },
    screens: {
      xs: "475px",
      ...defaultTheme.screens,
    },
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      backgroundColor: ["disabled", "odd"],
      textColor: ["disabled"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
