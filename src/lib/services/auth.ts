// lib/services/auth.ts
import { auth } from "../client/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
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
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
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

export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
    await fetch("/api/signin", { method: "DELETE" });
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

export async function signInAdmin(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const idToken = await user.getIdToken();

    const response = await fetch("/api/admin-signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      throw new Error("Admin sign in failed");
    }

    return user;
  } catch (error) {
    console.error("Error signing in admin:", error);
    throw error;
  }
}
