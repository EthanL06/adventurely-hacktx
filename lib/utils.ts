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

import type { Profiles } from "../types/profiles";
import type { Tasks, Task } from "../types/tasks";

import type { Profiles } from "../types/profiles";
import type { Tasks, Task } from "../types/tasks";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
