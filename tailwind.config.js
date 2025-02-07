/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        purpleLight:"#f6f4fe",
        purple:"#a294f9",
        purpleDark:"#7a6fbb",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        oswaldRegular: ["Oswald", "sans-serif"],
        oswaldLight: ["Oswald-Light", "sans-serif"],
        inriaBold: ["Inria-Bold", "sans-serif"],
        inriaRegular: ["Inria-Regular", "sans-serif"],
        inriaLight: ["Inria-Light", "sans-serif"],
      },
    },
  },
  plugins: [],
};
