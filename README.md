# to.do

A modern, minimalist todo application with Pomodoro timer integration.

**Live Demo:** https://to-1sviwzn9q-obliviex.vercel.app

## Features

- Task management with add, edit, delete, and complete functionality
- Pomodoro timer with customizable duration
- Multiple timer modes: Pomodoro (25 min), Short Break (5 min), Long Break (10 min)
- Custom timer duration input (1-120 minutes)
- Dynamic background colors based on timer mode
- Task statistics and streak tracking
- Responsive design with mobile support
- **List Organization**: Group tasks into custom lists/projects
- **Streak Tracking**: Track consecutive days with completed tasks
- **Progress Stats**: Visual chart showing task completion over the last 7 days
- **Search & Sort**: Filter tasks by search query and sort by date or name
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Local-First**: All data stored locally using IndexedDB (Dexie.js)

## Tech Stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling with custom theme
- **Zustand** for state management
- **Dexie.js** for IndexedDB persistence
- **Recharts** for progress visualization
- **Lucide React** for icons

## Design

- Light theme with near-white background (#FAFAF8)
- Monospace typography (JetBrains Mono / IBM Plex Mono)
- Clean green accent (#3FAE6A) for primary actions
- Card-based layout with thin borders
- Terminal/dev-tool aesthetic

## Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd to-do-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Build

To create a production build:
```bash
npm run build
```

## License

MIT
