"use cilent";

import { useEffect } from "react";
import {
  User,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { create } from "zustand";
import { auth } from "./firebase";

interface AuthStore {
  user: User | null;
  loading: boolean;
  token: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (loading) => set({ loading }),
  user: null,
  token: null,
  loading: false,
}));

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

export const firebaseSignIn = async () => {
  console.log("SIGNIN");
  signInWithPopup(auth, provider)
    .then(async (result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error(error);
    });
};

export const firebaseSignOut = async () => {
  try {
    await signOut(auth); // Reroute after signing out
    window.location.href = "/";
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

export const useAuth = () => {
  const { user, token, loading, setUser, setToken, setLoading } =
    useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
      } else {
        setToken(await user!.getIdToken());
      }
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, [setLoading, setToken, setUser]);

  return { user, token, loading, setLoading };
};
