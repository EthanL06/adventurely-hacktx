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
    getDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { create } from "zustand";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Profile, Profiles } from "../types/profiles";
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

const useProfileStore = create<Profile>((set) => ({
    profile: null,
    fetchProfile: async () => {
        await getDoc(doc(db, "profiles", auth.currentUser!.uid)).then(
            (doc) => {
                set({ profile: doc.data() as Profiles });
                console.log("Profile fetched: ", doc.data());
            },
            (error) => {
                console.error("Error fetching profile: ", error);
            },
        );
    },
}));

export const useProfile = () => {
    const { profile, fetchProfile } = useProfileStore();

    useEffect(() => {
        const q = query(collection(db, "profile"));
        const unsubscribe = onSnapshot(q, async () => {
            await fetchProfile();
        });

        return () => {
            unsubscribe();
        }
    }, [fetchProfile]);

    return { profile };
}


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
            // Get current profile stats
            const profile: Profiles = (
                await getDoc(doc(db, "profiles", auth.currentUser!.uid))
            ).data() as Profiles;
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
                            level:
                                profile.stats.xp % 100 === 0
                                    ? profile.stats.level + 1
                                    : profile.stats.level,
                        },
                    });
                }
            });
        });

        return () => {
            unsubscribe();
        };
    }, [fetchTasks]);

    return { tasksQuery, addTask, removeTask, updateTask, fetchSubtasks };
};
