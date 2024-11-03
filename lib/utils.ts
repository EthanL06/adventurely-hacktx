import { useEffect } from "react";
import {
  doc,
  collection,
  getDocs,
  addDoc,
  query,
  where,
  deleteDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { create } from "zustand";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// import type { Profiles } from "../types/profiles";
import type { Tasks, Task } from "../types/tasks";
import { getStats, getSubtasks } from "@/app/actions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const useTasksStore = create<Tasks>((set) => ({
  tasksQuery: null,
  fetchTasks: async () => {
    await getDocs(
      query(
        collection(db, "tasks"),
        where("uuid", "==", auth.currentUser?.uid),
      ),
    ).then(
      (querySnapshot) => {
        set({ tasksQuery: querySnapshot });
        console.log("Tasks fetched: ", querySnapshot);
      },
      (error) => {
        console.error("Error fetching tasks: ", error);
      },
    );
  },
  addTask: async (task: Task) => {
    if (!task.uuid) {
      task.uuid = auth.currentUser?.uid;
    }

    const { subtasks } = await getSubtasks({
      title: task.title,
      description: task.description,
    });

    console.log("Subtasks fetched: ", subtasks);

    task.subtasks = subtasks.subtasks;

    console.log("Task with subtasks: ", task);

    await addDoc(collection(db, "tasks"), task).then(
      (docRef) => {
        console.log("Document written with ID: ", docRef.id);
      },
      (error) => {
        console.error("Error adding document: ", error);
      },
    );
  },
  removeTask: async (docId) => {
    await deleteDoc(doc(db, "tasks", docId));
    console.log("Document deleted: ", docId);
  },
  updateTask: async (docId) => {
    await updateDoc(doc(db, "tasks", docId), {
      done: true,
    });
    console.log("Document updated: ", docId);
  },
  fetchSubtasks: async (docId) => {
    await getDocs(collection(db, "tasks", docId, "subtasks")).then(
      (querySnapshot) => {
        console.log("Subtasks fetched: ", querySnapshot);
      },
      (error) => {
        console.error("Error fetching subtasks: ", error);
      },
    );
  },
}));

export const useTasks = () => {
  const {
    tasksQuery,
    fetchTasks,
    addTask,
    removeTask,
    updateTask,
    fetchSubtasks,
  } = useTasksStore();

  useEffect(() => {
    const q = query(collection(db, "tasks"));
    const unsubscribe = onSnapshot(q, async () => {
      await fetchTasks();
    });

    return () => {
      unsubscribe();
    };
  }, [fetchTasks]);

  return { tasksQuery, addTask, removeTask, updateTask, fetchSubtasks };
};
