import { writable } from "svelte/store";
import { auth } from "../client/firebase";
import type { User } from "firebase/auth";

function userStore() {
  let unsubscribe: () => void;

  if (!auth || !globalThis.window) {
    console.warn("Auth is not initialized or not in browser");
    const { subscribe } = writable<User | null>(null);
    return { subscribe };
  }

  const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
    unsubscribe = auth.onAuthStateChanged(set);
    return () => unsubscribe();
  });

  return { subscribe };
}

export const user = userStore();

export const isRegistering = writable(true);

export function setIsRegistering(value: boolean) {
  isRegistering.set(value);
}
