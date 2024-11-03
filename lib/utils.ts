import { useEffect } from "react";
import { doc, collection, getDocs, getDoc, addDoc, query, where, deleteDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase"
import { create } from "zustand"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { Profiles } from "../types/profiles";
import type { Tasks, Task } from "../types/tasks";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


export const useTasksStore = create<Tasks>((set) => ({
    tasksQuery: null,
    fetchTasks: async () => {
        await getDocs(query(collection(db, "tasks"), where("uuid", "==", auth.currentUser?.uid)))
            .then((querySnapshot) => {
                set({ tasksQuery: querySnapshot });
                console.log("Tasks fetched: ", querySnapshot);
            }, (error) => {
                console.error("Error fetching tasks: ", error);
            });
    },
    addTask: async (task: Task) => {
        await addDoc(collection(db, "tasks"), task)
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
            }, (error) => {
                console.error("Error adding document: ", error);
            });
    },
    removeTask: async (docId) => {
        await deleteDoc(doc(db, "tasks", docId));
        console.log("Document deleted: ", docId);
    },
    updateTask: async (docId) => {
        await updateDoc(doc(db, "tasks", docId), {
            done: true
        });
        console.log("Document updated: ", docId);
    },
}))

export const useTasks = () => {
    const { tasksQuery, fetchTasks, addTask, removeTask, updateTask } = useTasksStore();

    useEffect(() => {
        const q = query(collection(db, "tasks"));
        const unsubscribe = onSnapshot(q, async () => {
            await fetchTasks();
            // Get current profile stats
            const profile: Profiles = (await getDoc(doc(db, "profiles", auth.currentUser!.uid))).data() as Profiles;
            tasksQuery?.docs.forEach(async (taskdoc) => {
                // Only add stats per each task marked done
                if (taskdoc.data().done) {
                    // Update profile stats
                    await updateDoc(doc(db, "profiles", auth.currentUser!.uid), {
                        stats: {
                            hp: profile.stats.hp + 1,
                            xp: profile.stats.xp + 5,
                            str: profile.stats.str + 1,
                            int: profile.stats.int + 1,
                            level: profile.stats.xp % 100 === 0 ? profile.stats.level + 1 : profile.stats.level
                        }
                    });
                }
            });
        });

        return () => {
            unsubscribe();
        }
    }, [fetchTasks, tasksQuery]);

    return { tasksQuery, addTask, removeTask, updateTask };
}