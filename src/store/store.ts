import { create } from 'zustand';
import { db } from '../db/db';
import type { Task, TaskList } from '../db/db';

interface TodoStore {
  tasks: Task[];
  lists: TaskList[];
  currentListId: number | null;
  currentView: 'home' | 'lists' | 'completed';
  searchQuery: string;
  sortBy: 'date' | 'name';
  streak: number;
  lastCompletedDate: Date | null;
  
  loadTasks: () => Promise<void>;
  loadLists: () => Promise<void>;
  addTask: (title: string, listId: number) => Promise<void>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleTaskComplete: (id: number) => Promise<void>;
  addList: (name: string, color: string) => Promise<void>;
  deleteList: (id: number) => Promise<void>;
  setCurrentListId: (id: number | null) => void;
  setCurrentView: (view: 'home' | 'lists' | 'completed') => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'date' | 'name') => void;
  calculateStreak: () => void;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  tasks: [],
  lists: [],
  currentListId: null,
  currentView: 'home',
  searchQuery: '',
  sortBy: 'date',
  streak: 0,
  lastCompletedDate: null,

  loadTasks: async () => {
    const tasks = await db.tasks.toArray();
    set({ tasks });
  },

  loadLists: async () => {
    const lists = await db.lists.toArray();
    if (lists.length === 0) {
      // Create default list
      const defaultList = await db.lists.add({
        name: 'Inbox',
        color: '#3FAE6A',
        createdAt: new Date()
      });
      lists.push({ id: defaultList, name: 'Inbox', color: '#3FAE6A', createdAt: new Date() });
    }
    set({ lists });
  },

  addTask: async (title: string, listId: number) => {
    const task = {
      title,
      completed: false,
      listId,
      createdAt: new Date()
    };
    const id = await db.tasks.add(task);
    set(state => ({ tasks: [...state.tasks, { ...task, id }] }));
  },

  updateTask: async (id: number, updates: Partial<Task>) => {
    await db.tasks.update(id, updates);
    set(state => ({
      tasks: state.tasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    }));
  },

  deleteTask: async (id: number) => {
    await db.tasks.delete(id);
    set(state => ({
      tasks: state.tasks.filter(task => task.id !== id)
    }));
  },

  toggleTaskComplete: async (id: number) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;

    const updates = {
      completed: !task.completed,
      completedAt: !task.completed ? new Date() : undefined
    };

    await db.tasks.update(id, updates);
    set(state => ({
      tasks: state.tasks.map(t => 
        t.id === id ? { ...t, ...updates } : t
      )
    }));

    if (updates.completed) {
      get().calculateStreak();
    }
  },

  addList: async (name: string, color: string) => {
    const list = {
      name,
      color,
      createdAt: new Date()
    };
    const id = await db.lists.add(list);
    set(state => ({ lists: [...state.lists, { ...list, id }] }));
  },

  deleteList: async (id: number) => {
    await db.lists.delete(id);
    // Delete all tasks in this list
    await db.tasks.where('listId').equals(id).delete();
    set(state => ({
      lists: state.lists.filter(list => list.id !== id),
      tasks: state.tasks.filter(task => task.listId !== id),
      currentListId: state.currentListId === id ? null : state.currentListId
    }));
  },

  setCurrentListId: (id: number | null) => set({ currentListId: id }),
  setCurrentView: (view: 'home' | 'lists' | 'completed') => set({ currentView: view }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSortBy: (sort: 'date' | 'name') => set({ sortBy: sort }),

  calculateStreak: () => {
    const { tasks, lastCompletedDate } = get();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const completedToday = tasks.some(task => 
      task.completed && 
      task.completedAt && 
      new Date(task.completedAt) >= today
    );

    if (completedToday) {
      if (lastCompletedDate) {
        const lastDate = new Date(lastCompletedDate);
        lastDate.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          set(state => ({ streak: state.streak + 1, lastCompletedDate: today }));
        } else if (diffDays > 1) {
          set({ streak: 1, lastCompletedDate: today });
        }
      } else {
        set({ streak: 1, lastCompletedDate: today });
      }
    }
  }
}));
