import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          orange: "#FF6B35",
          pink: "#FF2D78",
          purple: "#7B2FFF",
          deep: "#0D0A1A",
          card: "rgba(255,255,255,0.06)",
        },
      },
      backgroundImage: {
        "app-gradient":
          "radial-gradient(ellipse at top left, #3D1060 0%, #1A0533 40%, #2D0A20 70%, #1A0C05 100%)",
        "card-glass":
          "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)",
        "orange-pink": "linear-gradient(135deg, #FF6B35, #FF2D78)",
        "purple-blue": "linear-gradient(135deg, #7B2FFF, #2F80FF)",
        "green-teal": "linear-gradient(135deg, #00C48C, #0082B3)",
        "gold-amber": "linear-gradient(135deg, #F7B731, #FC5C7D)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
        glow: "0 0 30px rgba(255, 107, 53, 0.4)",
        "glow-purple": "0 0 30px rgba(123, 47, 255, 0.4)",
        card: "0 20px 60px rgba(0,0,0,0.5)",
      },
      animation: {
        "float": "float 3s ease-in-out infinite",
        "float-slow": "float 5s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "fade-up": "fadeUp 0.5s ease forwards",
        "confetti": "confettiFall 4s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        confettiFall: {
          "0%": { transform: "translateY(-10px) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(720deg)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;