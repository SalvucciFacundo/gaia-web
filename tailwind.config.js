/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./internal/views/**/*.templ",
    "./internal/views/**/*.go",
    "./internal/handlers/**/*.go",
    "./cmd/**/*.go",
    "./static/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        "bg-dark": "#07090e",
        "bg-surface": "#0e121d",
        "bg-card": "rgba(18, 24, 38, 0.65)",
        "bg-card-hover": "rgba(26, 35, 56, 0.85)",
        "neon-cyan": "#00f0ff",
        "neon-emerald": "#00ff9d",
        "neon-purple": "#9d4edd",
        "neon-blue": "#3a86ff",
        "text-primary": "#f8fafc",
        "text-secondary": "#94a3b8",
        "text-muted": "#64748b",
        "border-subtle": "rgba(255, 255, 255, 0.08)",
        "border-neon-cyan": "rgba(0, 240, 255, 0.25)",
        "border-neon-emerald": "rgba(0, 255, 157, 0.25)",
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Cascadia Code", "monospace"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.15" },
          "50%": { opacity: "0.25" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      backdropBlur: {
        glass: "16px",
      },
    },
  },
  plugins: [],
};
