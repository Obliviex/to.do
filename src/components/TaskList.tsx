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
    setSortBy,
    darkMode
  } = useTodoStore();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [isFunTask, setIsFunTask] = useState(false);
  const [isWantToBuyTask, setIsWantToBuyTask] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [subcategoryTitle, setSubcategoryTitle] = useState('');
  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<number>>(new Set());

  const filteredTasks = tasks
    .filter(task => {
      if (currentView === 'completed') return task.completed;
      if (currentView === 'fun') return task.isFun && !task.completed;
      if (currentView === 'wantToBuy') return task.isWantToBuy && !task.completed;
      return !task.isFun && !task.isWantToBuy && !task.completed && !task.parentTaskId;
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
    await addTask(
      newTaskTitle, 
      listId, 
      currentView === 'fun' ? true : isFunTask,
      currentView === 'wantToBuy' ? true : isWantToBuyTask,
      undefined
    );
    setNewTaskTitle('');
    setIsFunTask(false);
    setIsWantToBuyTask(false);
  };

  const handleAddSubcategory = async () => {
    if (!subcategoryTitle.trim() || !selectedTaskId) return;
    const listId = lists[0]?.id || 1;
    await addTask(subcategoryTitle, listId, false, false, selectedTaskId);
    setSubcategoryTitle('');
    setSelectedTaskId(null);
    // Expand the task to show the new subcategory
    setExpandedTaskIds(prev => new Set([...prev, selectedTaskId]));
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
    <div className="flex-1 p-4 lg:p-6 pt-16 lg:pt-6 relative">
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-2xl lg:text-3xl font-bold ${darkMode ? 'text-dark-text' : 'text-text'} mb-2`}>
          {currentView === 'home' && 'Tasks'}
          {currentView === 'fun' && 'Fun Tasks'}
          {currentView === 'wantToBuy' && 'Want to Buy'}
          {currentView === 'completed' && 'Completed'}
        </h1>
        <p className={`${darkMode ? 'text-dark-text-muted' : 'text-text-muted'} text-sm`}>
          {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
        </p>
      </div>

      {/* Search and Sort */}
      <div className="flex gap-3 mb-6 flex-col sm:flex-row">
        <div className="flex-1 relative">
          <Search size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-dark-text-muted' : 'text-text-muted'}`} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 ${darkMode ? 'bg-dark-card border-dark-border text-dark-text placeholder:text-dark-text-muted' : 'bg-card border-border text-text placeholder:text-text-muted'} rounded-lg text-sm focus:outline-none focus:border-accent`}
          />
        </div>
        <button
          onClick={() => setSortBy(sortBy === 'date' ? 'name' : 'date')}
          className={`px-4 py-2.5 ${darkMode ? 'bg-dark-card border-dark-border text-dark-text-muted hover:text-dark-text hover:border-accent' : 'bg-card border-border text-text-muted hover:text-text hover:border-accent'} rounded-lg transition-colors flex items-center gap-2 justify-center sm:justify-start`}
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
              placeholder={currentView === 'fun' ? "Add a fun activity..." : currentView === 'wantToBuy' ? "Add something to buy..." : "Add a new task..."}
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className={`flex-1 px-4 py-3 ${darkMode ? 'bg-dark-card border-dark-border text-dark-text placeholder:text-dark-text-muted' : 'bg-card border-border text-text placeholder:text-text-muted'} rounded-lg text-sm focus:outline-none focus:border-accent`}
            />
            <div className="flex gap-2">
              {currentView === 'home' && (
                <label className={`flex items-center gap-2 px-4 py-3 ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-card border-border'} rounded-lg cursor-pointer hover:border-accent transition-colors`}>
                  <input
                    type="checkbox"
                    checked={isFunTask}
                    onChange={(e) => setIsFunTask(e.target.checked)}
                    className="w-4 h-4 accent-accent"
                  />
                  <span className={`text-sm ${darkMode ? 'text-dark-text' : 'text-text'}`}>Fun</span>
                </label>
              )}
              {currentView === 'home' && (
                <label className={`flex items-center gap-2 px-4 py-3 ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-card border-border'} rounded-lg cursor-pointer hover:border-accent transition-colors`}>
                  <input
                    type="checkbox"
                    checked={isWantToBuyTask}
                    onChange={(e) => setIsWantToBuyTask(e.target.checked)}
                    className="w-4 h-4 accent-accent"
                  />
                  <span className={`text-sm ${darkMode ? 'text-dark-text' : 'text-text'}`}>Want to Buy</span>
                </label>
              )}
              <button
                type="submit"
                className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors flex items-center gap-2 font-medium justify-center"
              >
                <Plus size={18} />
                <span>Add</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className={`${darkMode ? 'bg-dark-card border-dark-border' : 'bg-card border-border'} rounded-card p-8 text-center`}>
            <p className={`${darkMode ? 'text-dark-text-muted' : 'text-text-muted'} text-sm`}>
              {currentView === 'completed' ? 'No completed tasks yet' : currentView === 'fun' ? 'No fun activities yet. Add one above!' : currentView === 'wantToBuy' ? 'No items to buy yet. Add one above!' : 'No tasks yet. Add one above!'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`${darkMode ? 'bg-dark-card border-dark-border' : 'bg-card border-border'} rounded-card p-4 flex items-start gap-4 transition-all relative ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <button
                onClick={() => toggleTaskComplete(task.id!)}
                className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors mt-0.5 ${
                  task.completed 
                    ? 'bg-accent border-accent text-white' 
                    : `${darkMode ? 'border-dark-border hover:border-accent' : 'border-border hover:border-accent'}`
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
                    className={`flex-1 px-3 py-2 ${darkMode ? 'bg-dark-background-dark border-dark-border text-dark-text' : 'bg-background border-border text-text'} rounded text-sm focus:outline-none focus:border-accent`}
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
                <div className="flex-1">
                  <span className={`text-sm block ${task.completed ? (darkMode ? 'line-through text-dark-text-muted' : 'line-through text-text-muted') : (darkMode ? 'text-dark-text' : 'text-text')}`}>
                    {task.title}
                  </span>
                  

                  {/* Subcategories - show when expanded */}
                  {expandedTaskIds.has(task.id!) && (
                    <div className="mt-3 space-y-2">
                      {tasks.filter(t => t.parentTaskId === task.id).map((subcategory) => (
                        <div key={subcategory.id} className="ml-4 flex items-center gap-2">
                          <span className={`${darkMode ? 'text-dark-text-muted' : 'text-text-muted'} text-sm`}>-</span>
                          <span className={`text-sm ${subcategory.completed ? (darkMode ? 'line-through text-dark-text-muted' : 'line-through text-text-muted') : (darkMode ? 'text-dark-text' : 'text-text')}`}>
                            {subcategory.title}
                          </span>
                          <button
                            onClick={() => toggleTaskComplete(subcategory.id!)}
                            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                              subcategory.completed 
                                ? 'bg-accent border-accent text-white' 
                                : `${darkMode ? 'border-dark-border hover:border-accent' : 'border-border hover:border-accent'}`
                            }`}
                          >
                            {subcategory.completed && <Check size={10} />}
                          </button>
                        </div>
                      ))}
                      {/* Inline add subcategory input */}
                      <div className="ml-4 flex items-center gap-2">
                        <span className={`${darkMode ? 'text-dark-text-muted' : 'text-text-muted'} text-sm`}>+</span>
                        <input
                          type="text"
                          placeholder="Add subcategory..."
                          value={selectedTaskId === task.id ? subcategoryTitle : ''}
                          onChange={(e) => {
                            setSubcategoryTitle(e.target.value);
                            setSelectedTaskId(task.id || null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddSubcategory();
                            }
                          }}
                          className={`flex-1 px-2 py-1 text-sm ${darkMode ? 'bg-dark-background-dark border-dark-border text-dark-text placeholder:text-dark-text-muted' : 'bg-background border-border text-text placeholder:text-text-muted'} rounded focus:outline-none focus:border-accent`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {editingId !== task.id && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditStart(task)}
                    className={`p-2 ${darkMode ? 'text-dark-text-muted hover:text-dark-text hover:bg-dark-background-dark' : 'text-text-muted hover:text-text hover:bg-background'} rounded transition-colors`}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id!)}
                    className={`p-2 ${darkMode ? 'text-dark-text-muted hover:text-red-500 hover:bg-dark-background-dark' : 'text-text-muted hover:text-red-500 hover:bg-background'} rounded transition-colors`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}

              {/* Plus button at bottom middle of task box */}
              <button
                onClick={() => {
                  const taskId = task.id!;
                  // Toggle expanded state
                  setExpandedTaskIds(prev => {
                    const newSet = new Set(prev);
                    if (newSet.has(taskId)) {
                      newSet.delete(taskId);
                    } else {
                      newSet.add(taskId);
                    }
                    return newSet;
                  });
                }}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-accent/20 text-accent rounded-full hover:bg-accent/30 transition-all flex items-center justify-center"
              >
                <Plus size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
