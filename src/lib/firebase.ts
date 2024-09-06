// firebase.ts
import { getApps, initializeApp } from "firebase/app";
import { doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  type User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { writable, type Readable, derived } from "svelte/store";

const firebaseConfig = {
  apiKey: "AIzaSyDnJHbXvYPHjjlKdLjh8kf3OucOE8iW6no",
  authDomain: "rehamdiva-a8819.firebaseapp.com",
  projectId: "rehamdiva-a8819",
  storageBucket: "rehamdiva-a8819.appspot.com",
  messagingSenderId: "913924175735",
  appId: "1:913924175735:web:a058d2c5da78b87cfbd372",
};

// Initialize Firebase
export const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();

// User store
function userStore() {
  let unsubscribe: () => void;

  if (!auth || !globalThis.window) {
    console.warn("Auth is not initialized or not in browser");
    const { subscribe } = writable<User | null>(null);
    return { subscribe };
  }

  const { subscribe } = writable(auth?.currentUser ?? null, (set) => {
    unsubscribe = onAuthStateChanged(auth, (user) => {
      set(user);
    });

    return () => unsubscribe();
  });

  return { subscribe };
}

export const user = userStore();

// User data interface
export interface UserData {
  fullName: string;
  email: string;
  phoneNumber: string;
}

// Document store
function docStore<T>(path: string) {
  let unsubscribe: () => void;

  const docRef = doc(db, path);

  const { subscribe } = writable<T | null>(null, (set) => {
    unsubscribe = onSnapshot(docRef, (snapshot) => {
      set((snapshot.data() as T) ?? null);
    });

    return () => unsubscribe();
  });

  return {
    subscribe,
    ref: docRef,
    id: docRef.id,
  };
}

// User data store
export const userData: Readable<UserData | null> = derived(
  user,
  ($user, set) => {
    if ($user) {
      return docStore<UserData>(`users/${$user.uid}`).subscribe(set);
    } else {
      set(null);
    }
  }
);

// Email/Password Registration
export async function registerWithEmailAndPassword(
  email: string,
  password: string,
  fullName: string,
  phoneNumber: string
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Store user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      fullName,
      email,
      phoneNumber,
    });

    return user;
  } catch (error) {
    console.error("Error registering new user:", error);
    throw error;
  }
}

// Email/Password Sign In
export async function signInWithCredentials(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
}
