import { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TaskList } from './components/TaskList';
import { StatsCard } from './components/StatsCard';
import { PomodoroTimer } from './components/PomodoroTimer';
import { useTodoStore } from './store/store';

function App() {
  const { loadTasks, loadLists, currentView } = useTodoStore();

  useEffect(() => {
    loadTasks();
    loadLists();
  }, [loadTasks, loadLists]);

  return (
    <div className="flex min-h-screen bg-background lg:pl-0">
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
