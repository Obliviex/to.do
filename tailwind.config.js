/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        background: '#F5F0E6',
        'background-dark': '#E8E0D0',
        card: '#FFFAF0',
        'card-light': '#FFF5E6',
        border: '#E8E0D0',
        text: '#2D2D2D',
        'text-muted': '#6B6B6B',
        accent: '#3FAE6A',
        'accent-hover': '#35965C',
        turquoise: '#40E0D0',
        blue: '#4A90E2',
      },
      borderRadius: {
        'card': '12px',
      },
    },
  },
  plugins: [],
}
