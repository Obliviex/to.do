import Dexie from 'dexie';
import type { Table } from 'dexie';

export interface Task {
  id?: number;
  title: string;
  completed: boolean;
  listId: number;
  createdAt: Date;
  completedAt?: Date;
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
    this.version(1).stores({
      tasks: '++id, listId, completed, createdAt, completedAt',
      lists: '++id, name, createdAt'
    });
  }
}

export const db = new TodoDatabase();
