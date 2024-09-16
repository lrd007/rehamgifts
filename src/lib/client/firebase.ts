// lib/client/firebase.ts
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAEI33y3QNamwb8IOQwelvJjoe-myVpFMo",
  authDomain: "reham-2025-48434.firebaseapp.com",
  projectId: "reham-2025-48434",
  storageBucket: "reham-2025-48434.appspot.com",
  messagingSenderId: "758939009368",
  appId: "1:758939009368:web:44e0153ef998f069b8a52d", 
};

export const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);
export const db = getFirestore();
export const auth = getAuth();
