import { useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TaskList } from './components/TaskList';
import { StatsCard } from './components/StatsCard';
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
        <div className="flex-1 lg:ml-64">
          <TaskList />
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
