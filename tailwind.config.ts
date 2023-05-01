import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "320px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "2500px",
    },
    extend: {
      backgroundColor: {
        'primary': '#72035d',
        'secondary': '#fff',
        'tertiary': '#560246',
        'accent': '#ffe8e8',
      },
      textColor: {
        'primary': '#fff',
        'secondary': '#72035d',
        'tertiary': '#fff',
        'accent': '#72035d',
      },
    },
  },
  plugins: [],
} satisfies Config;
