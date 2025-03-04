/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      screens: {
        DEFAULT: "1334px",
      },
    },
    extend: {
      boxShadow: {
        scrapMedia: "0px 4px 30px 0px #D5D9E5CC",
        scrapMediaLightSoft: "0px 0px 30px 0px rgba(213, 217, 229, 0.8)",
      },
      dropShadow: {
        scrapMedia: "0px 4px 30px 0px #D5D9E5CC",
        scrapMediaLightSoft: "0px 0px 30px 0px rgba(213, 217, 229, 0.8)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        purple: "rgba(132, 56, 201, 1)",
        "secondary-darkness": "rgba(55, 73, 87, 1)",
        "secondary-dark": "rgba(174, 178, 190, 1)",
        "secondary-soft": "rgba(213, 217, 229, 1)",
        blue: {
          DEFAULT: "#2563EB",
          100: "#DBEAFE",
        },
        lightPurple: "#f2eeff",
        "light-screen": "rgba(255, 255, 255, 0.7)",
        green: "rgba(0, 196, 98, 1)",
        yellow: "rgba(252, 182, 67, 1)",
        orange: "rgba(245, 62, 40, 1)",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideOutRight: {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-in-left": "slideInLeft 0.5s ease-in-out",
        "slide-out-right": "slideOutRight 0.5s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/line-clamp')],
};
