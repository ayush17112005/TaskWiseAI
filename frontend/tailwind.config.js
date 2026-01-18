/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // HackerRank green theme
        primary: {
          DEFAULT: "#1BA94C",
          light: "#4CAF50",
          dark: "#158239",
        },
        secondary: {
          DEFAULT: "#39424E",
          light: "#666666",
          dark: "#2C3239",
        },
        background: {
          DEFAULT: "#FFFFFF",
          gray: "#F9F9F9",
        },
        text: {
          primary: "#333333",
          secondary: "#666666",
        },
        success: "#1BA94C",
        error: "#E74C3C",
        warning: "#F39C12",
        info: "#3498DB",
      },
      fontFamily: {
        sans: ["Roboto", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
