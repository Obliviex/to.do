import { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TaskList } from './components/TaskList';
import { StatsCard } from './components/StatsCard';
import { PomodoroTimer } from './components/PomodoroTimer';
import { useTodoStore } from './store/store';

function App() {
  const { loadTasks, loadLists, currentView, timerMode } = useTodoStore();

  useEffect(() => {
    loadTasks();
    loadLists();
  }, [loadTasks, loadLists]);

  const getBackgroundColor = () => {
    switch (timerMode) {
      case 'pomodoro':
        return 'bg-accent';
      case 'shortBreak':
        return 'bg-turquoise';
      case 'longBreak':
        return 'bg-blue';
      default:
        return 'bg-background';
    }
  };

  return (
    <div className={`flex min-h-screen ${currentView === 'timer' ? getBackgroundColor() : 'bg-background'} lg:pl-0`}>
      <Sidebar />
      <main className="flex-1 flex lg:ml-0">
        <div className="flex-1 lg:ml-64 p-6">
          {currentView === 'timer' ? (
            <div className="max-w-2xl mx-auto pt-8">
              <PomodoroTimer />
            </div>
          ) : (
            <TaskList />
          )}
        </div>
        {currentView === 'home' && (
          <aside className="hidden lg:block w-80 p-6 border-l border-border">
            <StatsCard />
          </aside>
        )}
      </main>
    </div>
  );
}

export default App;
