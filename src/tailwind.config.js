module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surrealRed: "#e74c3c",
        surrealDarkRed: "#c0392b",
      },
      boxShadow: {
        surreal: "0 4px 8px rgba(0, 0, 0, 0.5)",
        surrealHover: "0 6px 12px rgba(0, 0, 0, 0.7)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        syne: ["Syne", "sans-serif"],
      },
    },
  },
  plugins: [],
}
