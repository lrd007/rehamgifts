// $lib/services/auth.ts
import { auth, db } from "../client/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  type User,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import type { UserData } from "../types";
import { handleAuthError } from "./handleAuthError";

export type AuthError = {
  code: string;
  message: string;
};

const createUserData = (
  user: User,
  name: string,
  country: string,
  phoneNumber: string
): UserData => ({
  id: user.uid,
  name,
  email: user.email!,
  country,
  phoneNumber,
  watchedVideos: [],
});

export const registerWithEmailAndPassword = async (
  email: string,
  password: string,
  name: string,
  country: string,
  phoneNumber: string
): Promise<User> => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userData = createUserData(user, name, country, phoneNumber);
    await setDoc(doc(db, "users", user.uid), userData);
    await sendIdTokenToServer(user);

    // await sendMail(email, name);

    return user;
  } catch (error) {
    throw new Error(handleAuthError(error as AuthError));
  }
};

const sendIdTokenToServer = async (user: User): Promise<void> => {
  const idToken = await user.getIdToken();
  const response = await fetch("/api/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }
};

export const signInWithCredentials = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    await sendIdTokenToServer(user);
    return user;
  } catch (error) {
    throw new Error(handleAuthError(error as AuthError));
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw new Error(handleAuthError(error as AuthError));
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    console.log("loging out");
    await signOut(auth);
    await fetch("/api/signin", { method: "DELETE" });
  } catch (error) {
    throw new Error(handleAuthError(error as AuthError));
  }
};

export const signInAdmin = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await user.getIdToken();

    const response = await fetch("/api/admin-signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      throw new Error("Admin sign in failed");
    }

    return user;
  } catch (error) {
    throw new Error(handleAuthError(error as AuthError));
  }
};
async function sendMail(email: string, name: string) {
  try {
    const welcomeEmailResponse = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        name: name,
        subject: "مرحبا بك على متن!", // "Welcome Onboard!" in Arabic
        variables: {
          name: name,
          // Add any other variables your template uses
        },
      }),
    });

    if (!welcomeEmailResponse.ok) {
      console.error(
        "Failed to send welcome email:",
        await welcomeEmailResponse.text()
      );
    }
  } catch (emailError) {
    console.error("Error sending welcome email:", emailError);
  }
}

