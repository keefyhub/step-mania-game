import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        'press': 'press .3s cubic-bezier(0, 0, 0.2, 1) '
      },
      keyframes: {
        press: {
          '0%, 100%': { backgroundColor: 'transparent', transform: 'scale3d(1, 1, 1)' },
          '50%': { backgroundColor: 'rgb(244 63 94)', transform: 'scale3d(1.05, 1.05, 1.05)' }
        }
      }
    },
  },
  plugins: [],
};
export default config;
