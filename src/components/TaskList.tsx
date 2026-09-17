import { useState } from 'react';
import { Plus, Search, SortAsc, Check, X, Pencil, Trash2 } from 'lucide-react';
import { useTodoStore } from '../store/store';

export function TaskList() {
  const { 
    tasks, 
    lists, 
    currentView, 
    searchQuery, 
    sortBy,
    addTask, 
    updateTask, 
    deleteTask, 
    toggleTaskComplete,
    setSearchQuery,
    setSortBy
  } = useTodoStore();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredTasks = tasks
    .filter(task => {
      if (currentView === 'completed') return task.completed;
      return !task.completed;
    })
    .filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return a.title.localeCompare(b.title);
    });

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const listId = lists[0]?.id || 1;
    await addTask(newTaskTitle, listId);
    setNewTaskTitle('');
  };

  const handleEditStart = (task: any) => {
    setEditingId(task.id!);
    setEditTitle(task.title);
  };

  const handleEditSave = async (id: number) => {
    await updateTask(id, { title: editTitle });
    setEditingId(null);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle('');
  };

  return (
    <div className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-text mb-2">
          {currentView === 'home' && 'Tasks'}
          {currentView === 'completed' && 'Completed'}
        </h1>
        <p className="text-text-muted text-sm">
          {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
        </p>
      </div>

      {/* Search and Sort */}
      <div className="flex gap-3 mb-6 flex-col sm:flex-row">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent"
          />
        </div>
        <button
          onClick={() => setSortBy(sortBy === 'date' ? 'name' : 'date')}
          className="px-4 py-2.5 bg-card border border-border rounded-lg text-text-muted hover:text-text hover:border-accent transition-colors flex items-center gap-2 justify-center sm:justify-start"
        >
          <SortAsc size={18} />
          <span className="text-sm">{sortBy === 'date' ? 'Date' : 'Name'}</span>
        </button>
      </div>

      {/* Add Task Form */}
      {currentView !== 'completed' && (
        <form onSubmit={handleAddTask} className="mb-6">
          <div className="flex gap-3 flex-col sm:flex-row">
            <input
              type="text"
              placeholder="Add a new task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 px-4 py-3 bg-card border border-border rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors flex items-center gap-2 font-medium justify-center"
            >
              <Plus size={18} />
              <span>Add</span>
            </button>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="bg-card border border-border rounded-card p-8 text-center">
            <p className="text-text-muted text-sm">
              {currentView === 'completed' ? 'No completed tasks yet' : 'No tasks yet. Add one above!'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-card border border-border rounded-card p-4 flex items-center gap-4 transition-all ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <button
                onClick={() => toggleTaskComplete(task.id!)}
                className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                  task.completed 
                    ? 'bg-accent border-accent text-white' 
                    : 'border-border hover:border-accent'
                }`}
              >
                {task.completed && <Check size={14} />}
              </button>

              {editingId === task.id ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 px-3 py-2 bg-background border border-border rounded text-sm text-text focus:outline-none focus:border-accent"
                    autoFocus
                  />
                  <button
                    onClick={() => handleEditSave(task.id!)}
                    className="p-2 text-accent hover:bg-accent/10 rounded transition-colors"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="p-2 text-text-muted hover:text-text hover:bg-background rounded transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <span className={`flex-1 text-sm ${task.completed ? 'line-through text-text-muted' : 'text-text'}`}>
                    {task.title}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditStart(task)}
                      className="p-2 text-text-muted hover:text-text hover:bg-background rounded transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id!)}
                      className="p-2 text-text-muted hover:text-red-500 hover:bg-background rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
