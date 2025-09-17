/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Front Stay
        primary: {
          teal: "#00A3A3",
          "teal-light": "#1AB5B5",
          "teal-dark": "#008080",
        },
        secondary: {
          purple: "#2D1B69",
          "purple-light": "#4A3B8C",
          "purple-dark": "#1F1247",
        },
        accent: {
          orange: "#E67E22",
          "orange-light": "#F39C12",
          "orange-dark": "#D35400",
        },
        neutral: {
          dark: "#2C3E50",
          medium: "#7F8C8D",
          light: "#BDC3C7",
          lighter: "#ECF0F1",
        },
        support: {
          green: "#27AE60",
          blue: "#3498DB",
          pink: "#E91E63",
          brown: "#8D6E63",
        },

        // Adicionado para o fundo principal (era #eae8e5)
        frontstay: "#eae8e5",
      },
      fontFamily: {
        questa: ["Questa Sans", "Inter", "system-ui", "sans-serif"],
        sans: ["Questa Sans", "Inter", "system-ui", "sans-serif"],
      },
      fontWeight: {
        "questa-light": "300",
        "questa-regular": "400",
        "questa-medium": "500",
        "questa-bold": "700",
        "questa-black": "900",
      },
      letterSpacing: {
        tighter: "-0.03em",
        tight: "-0.02em",
        snug: "-0.01em",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #00A3A3 0%, #2D1B69 100%)",
        "gradient-accent": "linear-gradient(135deg, #E67E22 0%, #00A3A3 100%)",
        "gradient-neutral": "linear-gradient(135deg, #ECF0F1 0%, #BDC3C7 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "geometric-pattern": `
          radial-gradient(circle at 25% 25%, rgba(0, 163, 163, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(45, 27, 105, 0.05) 0%, transparent 50%)
        `,
        "dots-pattern": "radial-gradient(circle, #00A3A3 1px, transparent 1px)",
        "lines-pattern":
          "linear-gradient(45deg, transparent 40%, #00A3A3 40%, #00A3A3 60%, transparent 60%)",
      },
      backgroundSize: {
        dots: "24px 24px",
        lines: "32px 32px",
      },
      animation: {
        "float-subtle": "float-subtle 4s ease-in-out infinite",
        "pulse-glow-subtle": "pulse-glow-subtle 2s ease-in-out infinite",
        "gradient-shift": "gradient-shift 6s ease infinite",
        shimmer: "shimmer 1.5s infinite",
        "fade-in-up": "fadeInUp 0.6s ease forwards",
        "fade-in-left": "fadeInLeft 0.6s ease forwards",
        "fade-in-right": "fadeInRight 0.6s ease forwards",
      },
      keyframes: {
        "float-subtle": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-glow-subtle": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(0, 163, 163, 0.2)" },
          "50%": { boxShadow: "0 0 20px rgba(0, 163, 163, 0.4)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeInUp: {
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadeInLeft: {
          to: {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        fadeInRight: {
          to: {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
      },
      boxShadow: {
        glass: "0 4px 16px 0 rgba(31, 38, 135, 0.15)",
        "glass-subtle": "0 2px 8px 0 rgba(31, 38, 135, 0.1)",
        glow: "0 0 10px rgba(0, 163, 163, 0.2)",
        "glow-lg": "0 0 20px rgba(0, 163, 163, 0.4)",
        card: "0 4px 12px rgba(0, 0, 0, 0.05)",
        "card-hover": "0 8px 24px rgba(0, 0, 0, 0.08)",
        clean: "0 2px 8px rgba(0, 0, 0, 0.04)",
        "clean-hover": "0 4px 16px rgba(0, 0, 0, 0.08)",
      },
      backdropBlur: {
        xs: "2px",
        subtle: "6px",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
      screens: {
        xs: "475px",
        "3xl": "1600px",
      },
      aspectRatio: {
        "4/3": "4 / 3",
        "3/2": "3 / 2",
        "2/3": "2 / 3",
        "9/16": "9 / 16",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};