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
  const [isFunTask, setIsFunTask] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [durationOption, setDurationOption] = useState<'none' | 'allDay' | 'allWeek' | 'allMonth'>('none');
  const [showTagModal, setShowTagModal] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);

  const filteredTasks = tasks
    .filter(task => {
      if (currentView === 'completed') return task.completed;
      if (currentView === 'fun') return task.isFun && !task.completed;
      return !task.isFun && !task.completed;
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
    const parsedDueDate = dueDate ? new Date(dueDate) : undefined;
    await addTask(
      newTaskTitle, 
      listId, 
      currentView === 'fun' ? true : isFunTask,
      tags.length > 0 ? tags : undefined,
      startTime || undefined,
      endTime || undefined,
      parsedDueDate,
      durationOption !== 'none' ? durationOption : undefined
    );
    setNewTaskTitle('');
    setIsFunTask(false);
    setTags([]);
    setTagInput('');
    setStartTime('');
    setEndTime('');
    setDueDate('');
    setDurationOption('none');
    setShowAdvancedOptions(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
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
        <h1 className="text-2xl lg:text-3xl font-bold text-text mb-2">
          {currentView === 'home' && 'Tasks'}
          {currentView === 'fun' && 'Fun Tasks'}
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
              placeholder={currentView === 'fun' ? "Add a fun activity..." : "Add a new task..."}
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 px-4 py-3 bg-card border border-border rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
            <div className="flex gap-2">
              {currentView === 'home' && (
                <label className="flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-lg cursor-pointer hover:border-accent transition-colors">
                  <input
                    type="checkbox"
                    checked={isFunTask}
                    onChange={(e) => setIsFunTask(e.target.checked)}
                    className="w-4 h-4 accent-accent"
                  />
                  <span className="text-sm text-text">Fun</span>
                </label>
              )}
              <button
                type="button"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="px-4 py-3 bg-card border border-border rounded-lg text-text-muted hover:text-text hover:border-accent transition-colors flex items-center gap-2 justify-center"
              >
                <span className="text-sm">Options</span>
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors flex items-center gap-2 font-medium justify-center"
              >
                <Plus size={18} />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Advanced Options */}
          {showAdvancedOptions && (
            <div className="mt-4 p-4 bg-card border border-border rounded-lg space-y-4">
              {/* Tags */}
              <div>
                <label className="text-sm text-text-muted mb-2 block">Tags (subcategories)</label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-accent-hover"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-3 py-2 bg-background border border-border rounded text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-accent text-white rounded hover:bg-accent-hover transition-colors text-sm"
                  >
                    Add Tag
                  </button>
                </div>
              </div>

              {/* Time Range */}
              <div>
                <label className="text-sm text-text-muted mb-2 block">Time Range</label>
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="flex-1 px-3 py-2 bg-background border border-border rounded text-sm text-text focus:outline-none focus:border-accent"
                  />
                  <span className="text-text-muted self-center">to</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="flex-1 px-3 py-2 bg-background border border-border rounded text-sm text-text focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="text-sm text-text-muted mb-2 block">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded text-sm text-text focus:outline-none focus:border-accent"
                />
              </div>

              {/* Duration Option */}
              <div>
                <label className="text-sm text-text-muted mb-2 block">Duration</label>
                <select
                  value={durationOption}
                  onChange={(e) => setDurationOption(e.target.value as any)}
                  className="w-full px-3 py-2 bg-background border border-border rounded text-sm text-text focus:outline-none focus:border-accent"
                >
                  <option value="none">None</option>
                  <option value="allDay">All Day</option>
                  <option value="allWeek">All Week</option>
                  <option value="allMonth">All Month</option>
                </select>
              </div>
            </div>
          )}
        </form>
      )}

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="bg-card border border-border rounded-card p-8 text-center">
            <p className="text-text-muted text-sm">
              {currentView === 'completed' ? 'No completed tasks yet' : currentView === 'fun' ? 'No fun activities yet. Add one above!' : 'No tasks yet. Add one above!'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-card border border-border rounded-card p-4 flex items-start gap-4 transition-all relative ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              <button
                onClick={() => toggleTaskComplete(task.id!)}
                className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors mt-0.5 ${
                  task.completed 
                    ? 'bg-accent border-accent text-white' 
                    : 'border-border hover:border-accent'
                }`}
              >
                {task.completed && <Check size={14} />}
              </button>

              {/* Time and Due Date Controls */}
              <div className="flex gap-2 items-center mt-0.5">
                <input
                  type="time"
                  value={task.startTime || ''}
                  onChange={(e) => updateTask(task.id!, { startTime: e.target.value })}
                  className="px-2 py-1 bg-background border border-border rounded text-xs text-text focus:outline-none focus:border-accent"
                />
                <input
                  type="time"
                  value={task.endTime || ''}
                  onChange={(e) => updateTask(task.id!, { endTime: e.target.value })}
                  className="px-2 py-1 bg-background border border-border rounded text-xs text-text focus:outline-none focus:border-accent"
                />
                <input
                  type="date"
                  value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => updateTask(task.id!, { dueDate: e.target.value ? new Date(e.target.value) : undefined })}
                  className="px-2 py-1 bg-background border border-border rounded text-xs text-text focus:outline-none focus:border-accent"
                />
              </div>

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
                <div className="flex-1">
                  <span className={`text-sm block ${task.completed ? 'line-through text-text-muted' : 'text-text'}`}>
                    {task.title}
                  </span>
                  
                  {/* Task Details */}
                  <div className="mt-2 flex flex-wrap gap-2 items-center">
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {task.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-accent/10 text-accent rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    {task.durationOption && task.durationOption !== 'none' && (
                      <span className="text-xs text-accent">
                        {task.durationOption === 'allDay' ? 'All Day' : task.durationOption === 'allWeek' ? 'All Week' : 'All Month'}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {editingId !== task.id && (
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
              )}

              {/* Plus button at bottom middle of task box */}
              <button
                onClick={() => setShowTagModal(true)}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-accent/20 text-accent rounded-full hover:bg-accent/30 transition-all flex items-center justify-center"
              >
                <Plus size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Tag Modal */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-card p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-text mb-4">Manage Tags</h2>
            <div className="space-y-3 mb-4">
              {allTags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center justify-between p-3 bg-background rounded-lg"
                >
                  <span className="text-text">{tag}</span>
                  <button
                    onClick={() => setAllTags(allTags.filter(t => t !== tag))}
                    className="text-text-muted hover:text-red-500"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New tag name..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-background border border-border rounded text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent"
              />
              <button
                onClick={() => {
                  if (tagInput.trim() && !allTags.includes(tagInput.trim())) {
                    setAllTags([...allTags, tagInput.trim()]);
                    setTagInput('');
                  }
                }}
                className="px-4 py-2 bg-accent text-white rounded hover:bg-accent-hover transition-colors"
              >
                Add
              </button>
            </div>
            <button
              onClick={() => setShowTagModal(false)}
              className="w-full mt-4 px-4 py-2 bg-background border border-border rounded text-text hover:border-accent transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
