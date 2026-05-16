import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        clinic: {
          ink: "#17212b",
          muted: "#64727d",
          teal: "#188a8a",
          soft: "#e9f7f5",
          line: "#dce7e6",
          wash: "#f7fbfb"
        }
      },
      boxShadow: {
        soft: "0 18px 50px rgba(15, 57, 58, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
