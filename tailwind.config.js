/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Lexend"', 'sans-serif'],
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
        'accent-dark': '#2D8A52',
        'accent-darker': '#1E5A35',
        turquoise: '#40E0D0',
        'turquoise-dark': '#2DB8A8',
        'turquoise-darker': '#1A7868',
        blue: '#4A90E2',
        'blue-dark': '#3A70C2',
        'blue-darker': '#1E4080',
        // Dark mode colors
        'dark-background': '#1A1A1A',
        'dark-background-dark': '#2A2A2A',
        'dark-card': '#252525',
        'dark-card-light': '#303030',
        'dark-border': '#3A3A3A',
        'dark-text': '#E5E5E5',
        'dark-text-muted': '#A0A0A0',
      },
      borderRadius: {
        'card': '12px',
      },
    },
  },
  plugins: [],
}
