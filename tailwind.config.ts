import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        carbon: {
          950: "#070707",
          900: "#111111",
          850: "#171717",
          800: "#202020"
        },
        rescue: {
          500: "#ff6a00",
          600: "#e85f00"
        }
      },
      boxShadow: {
        soft: "0 18px 60px rgba(0,0,0,0.28)"
      }
    }
  },
  plugins: []
};

export default config;
