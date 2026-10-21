import { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TaskList } from './components/TaskList';
import { StatsCard } from './components/StatsCard';
import { PomodoroTimer } from './components/PomodoroTimer';
import { WritingMode } from './components/WritingMode';
import { useTodoStore } from './store/store';

function App() {
  const { loadTasks, loadLists, currentView, timerMode, darkMode } = useTodoStore();

  useEffect(() => {
    loadTasks();
    loadLists();
  }, [loadTasks, loadLists]);

  const getBackgroundColor = () => {
    switch (timerMode) {
      case 'pomodoro':
        return 'bg-accent-dark';
      case 'shortBreak':
        return 'bg-turquoise-dark';
      case 'longBreak':
        return 'bg-blue-dark';
      default:
        return 'bg-background';
    }
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-dark-background text-dark-text' : 'bg-background text-text'} ${currentView === 'timer' ? getBackgroundColor() : ''} lg:pl-0`}>
      {currentView !== 'writing' && <Sidebar />}
      <main className="flex-1 flex lg:ml-0">
        <div className={`flex-1 ${currentView === 'writing' ? '' : 'lg:ml-64'} p-6`}>
          {currentView === 'timer' ? (
            <div className="max-w-2xl mx-auto pt-8">
              <PomodoroTimer />
            </div>
          ) : currentView === 'writing' ? (
            <WritingMode />
          ) : (
            <TaskList />
          )}
        </div>
        {currentView === 'home' && (
          <aside className={`hidden lg:block w-80 p-6 border-l ${darkMode ? 'border-dark-border' : 'border-border'}`}>
            <StatsCard />
          </aside>
        )}
      </main>
    </div>
  );
}

export default App;
