import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDnJHbXvYPHjjlKdLjh8kf3OucOE8iW6no",
  authDomain: "rehamdiva-a8819.firebaseapp.com",
  projectId: "rehamdiva-a8819",
  storageBucket: "rehamdiva-a8819.appspot.com",
  messagingSenderId: "913924175735",
  appId: "1:913924175735:web:a058d2c5da78b87cfbd372",
};

export const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
