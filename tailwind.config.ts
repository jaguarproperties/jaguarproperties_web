import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1280px"
      }
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))"
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"]
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(120deg, rgba(10,10,10,0.86), rgba(10,10,10,0.38))",
        "mesh-gold":
          "radial-gradient(circle at top, rgba(184,144,74,0.18), transparent 40%), radial-gradient(circle at bottom right, rgba(184,144,74,0.1), transparent 30%)"
      },
      boxShadow: {
        luxe: "0 24px 60px rgba(0,0,0,0.28)"
      }
    }
  },
  plugins: []
};

export default config;
