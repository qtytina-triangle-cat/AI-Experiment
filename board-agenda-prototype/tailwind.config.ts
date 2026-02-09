import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        neutral: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
        },
        success: {
          base: "#16a34a",
          bg: "#dcfce7",
        },
        error: {
          base: "#ef4444",
          light: "#fca5a5",
          bg: "#fee2e2",
        },
        warning: {
          base: "#ea580c",
          bg: "#ffedd5",
        },
        info: {
          base: "#3b82f6",
          bg: "#eff6ff",
        },
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        DEFAULT: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      backgroundImage: {
        "gradient-avatar": "linear-gradient(to right, #2dd4bf, #06b6d4)",
        "gradient-user": "linear-gradient(to right, #60a5fa, #3b82f6)",
        "gradient-collaborator": "linear-gradient(to right, #c084fc, #a855f7)",
        "gradient-calendar": "linear-gradient(to right, #f87171, #ef4444)",
      },
    },
  },
  plugins: [],
};

export default config;
