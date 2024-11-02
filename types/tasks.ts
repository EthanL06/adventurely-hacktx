import type { QuerySnapshot } from "firebase/firestore";

export interface Task {
    uuid: string | null;
    title: string | null;
    description: string | null;
    done: boolean;
    due_date: Date | null;
}

export interface Tasks {
    tasksQuery: QuerySnapshot | null;
    fetchTasks: () => void;
    addTask: (task: Task) => void;
    removeTask: (docId: string) => void;
    updateTask: (docId: string) => void;
}
