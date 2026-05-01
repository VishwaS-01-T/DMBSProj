/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          bg: "#F8F9FB",
          surface: "#FFFFFF",
          surface2: "#F1F4F8",
          border: "#E4E8EF"
        },
        brand: {
          primary: "#2C63E5",
          primarySoft: "#EEF3FD",
          accent: "#00C6A2"
        },
        scholarship: {
          external: "#5B6AF0",
          merit: "#F59E0B",
          athletics: "#10B981",
          mcm: "#8B5CF6"
        },
        status: {
          approved: "#10B981",
          pending: "#F59E0B",
          rejected: "#EF4444",
          review: "#3B82F6",
          expired: "#9CA3AF"
        },
        text: {
          primary: "#111827",
          secondary: "#6B7280",
          muted: "#9CA3AF"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "'Fira Code'", "monospace"]
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "20px",
        xl: "28px"
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        md: "0 4px 12px rgba(0,0,0,0.08)",
        lg: "0 12px 32px rgba(0,0,0,0.10)",
        card: "0 2px 8px rgba(44,99,229,0.07)"
      }
    }
  },
  plugins: []
};
