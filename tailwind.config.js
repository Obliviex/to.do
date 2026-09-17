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
        background: '#A54A4A',
        'background-dark': '#8B3A3A',
        card: '#BC5F5F',
        'card-light': '#D97A7A',
        border: '#C96B6B',
        text: '#FFFFFF',
        'text-muted': '#E8D5D5',
        accent: '#3FAE6A',
        'accent-hover': '#35965C',
      },
      borderRadius: {
        'card': '12px',
      },
    },
  },
  plugins: [],
}
