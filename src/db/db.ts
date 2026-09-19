import Dexie from 'dexie';
import type { Table } from 'dexie';

export interface Task {
  id?: number;
  title: string;
  completed: boolean;
  listId: number;
  createdAt: Date;
  completedAt?: Date;
  isFun?: boolean;
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
    this.version(2).stores({
      tasks: '++id, listId, completed, createdAt, completedAt, isFun',
      lists: '++id, name, createdAt'
    });
  }
}

export const db = new TodoDatabase();
