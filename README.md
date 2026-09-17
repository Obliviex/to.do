# to.do

A simple, clean to-do list app with a bright, terminal-inspired aesthetic. Built with React, TypeScript, Tailwind CSS, Zustand, and Dexie.js for local-first persistence.

**Live Demo:** https://to-1sviwzn9q-obliviex.vercel.app

## Features

- **Task Management**: Add, edit, complete, and delete tasks
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
