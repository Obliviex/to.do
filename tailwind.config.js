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
        background: '#FAFAF8',
        card: '#FFFFFF',
        border: '#E5E5E3',
        text: '#1A1A1A',
        'text-muted': '#6B6B6B',
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
