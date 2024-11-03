import type { QuerySnapshot, Timestamp } from "firebase/firestore";

export interface Task {
  uuid?: string | null;
  title: string | null;
  description: string | null;
  done: boolean;
  due_date: Timestamp | null;
  subtasks?: {
    title: string | null;
    description: string | null;
    done: boolean;
  }[];
}

export interface Tasks {
  tasksQuery: QuerySnapshot | null;
  fetchTasks: () => void;
  fetchSubtasks: (docId: string) => void;
  addTask: (task: Task) => void;
  removeTask: (docId: string) => void;
  updateTask: (docId: string) => void;
}
