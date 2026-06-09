/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "nav": "#1F2937",
        "divider": "#262626",
        "logo-divider": "#135885",
        "link":"#135885",
        "dashboard-color":"#C2C2C2",
        "accent-blue":"#0088FF",
        "dashboard-bg":"#030304"
      },
    },
  },
  plugins: [],
};
