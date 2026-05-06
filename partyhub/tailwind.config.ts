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
        serif: ["Playfair Display", "Georgia", "serif"],
      },
      colors: {
        dtd: {
          bg: "#0B0B0C",
          "bg-2": "#141416",
          amber: "#C68A2B",
          "amber-light": "#E5A94A",
          "amber-dark": "#9A6820",
          merlot: "#5A0F2E",
          "merlot-light": "#7A1840",
          text: "#F5F5F5",
          "text-2": "#A1A1AA",
          "text-3": "#52525B",
          card: "rgba(255,255,255,0.04)",
          "card-hover": "rgba(255,255,255,0.07)",
          border: "rgba(255,255,255,0.08)",
          "amber-border": "rgba(198,138,43,0.4)",
          "amber-glow": "rgba(198,138,43,0.15)",
        },
      },
      backgroundImage: {
        "app-bg":
          "radial-gradient(ellipse at 50% 0%, #1A0E05 0%, #0B0B0C 60%)",
        "amber-gradient": "linear-gradient(135deg, #C68A2B, #E5A94A)",
        "merlot-gradient": "linear-gradient(135deg, #5A0F2E, #7A1840)",
        "amber-merlot": "linear-gradient(135deg, #C68A2B 0%, #5A0F2E 100%)",
        "card-glass":
          "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
        "amber-subtle":
          "radial-gradient(ellipse at top, rgba(198,138,43,0.12) 0%, transparent 70%)",
        "merlot-subtle":
          "radial-gradient(ellipse at top, rgba(90,15,46,0.2) 0%, transparent 70%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
        amber: "0 0 30px rgba(198,138,43,0.35)",
        "amber-sm": "0 0 16px rgba(198,138,43,0.25)",
        merlot: "0 0 30px rgba(90,15,46,0.4)",
        card: "0 20px 60px rgba(0,0,0,0.6)",
        "btn-amber": "0 8px 28px rgba(198,138,43,0.4)",
        "btn-amber-active": "0 4px 14px rgba(198,138,43,0.3)",
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "float-slow": "float 6s ease-in-out infinite",
        "pulse-amber": "pulseAmber 2s ease-in-out infinite",
        "fade-up": "fadeUp 0.5s ease forwards",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseAmber: {
          "0%, 100%": { opacity: "0.6", boxShadow: "0 0 20px rgba(198,138,43,0.3)" },
          "50%": { opacity: "1", boxShadow: "0 0 40px rgba(198,138,43,0.6)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;