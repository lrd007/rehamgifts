import { auth } from "../client/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../client/firebase";
import type { UserData } from "../types";

export async function registerWithEmailAndPassword(
  email: string,
  password: string,
  fullName: string,
  phoneNumber: string
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const newUserData: UserData = {
      id: user.uid,
      fullName,
      email,
      phoneNumber,
      watchedVideos: [],
    };
    await setDoc(doc(db, "users", user.uid), newUserData);

    return user;
  } catch (error) {
    console.error("Error registering new user:", error);
    throw error;
  }
}

export async function signInWithCredentials(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
}

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
}