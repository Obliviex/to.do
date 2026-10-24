import Dexie from 'dexie';
import type { Table } from 'dexie';

export interface Task {
  id?: number;
  title: string;
  completed: boolean;
  listId: number;
  isFun?: boolean;
  isWantToBuy?: boolean;
  parentTaskId?: number;
  priority?: 'low' | 'medium' | 'high';
  isScheduled?: boolean;
  scheduledTime?: string;
  completedAt?: Date;
  createdAt: Date;
}

export interface TaskList {
  id?: number;
  name: string;
  color: string;
  createdAt: Date;
}

export class TodoDatabase extends Dexie {
  tasks!: Table<Task>;
  lists!: Table<TaskList>;

  constructor() {
    super('TodoDatabase');
    this.version(8).stores({
      tasks: '++id, listId, completed, createdAt, completedAt, isFun, isWantToBuy, parentTaskId, priority, isScheduled, scheduledTime',
      lists: '++id, name, createdAt'
    });
  }
}

export const db = new TodoDatabase();
