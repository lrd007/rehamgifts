import { writable } from "svelte/store";
import { auth, db } from "../client/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import type { UserData } from "../types";

export const userData = writable<UserData | null>(null);

auth.onAuthStateChanged((firebaseUser) => {
  if (firebaseUser) {
    const userDocRef = doc(db, "users", firebaseUser.uid);
    onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        userData.set({
          id: snapshot.id,
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          watchedVideos: data.watchedVideos,
        });
      } else {
        console.log("No such document!");
        userData.set(null);
      }
    });
  } else {
    userData.set(null);
  }
});
