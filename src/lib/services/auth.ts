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

type AuthError = {
  code: string;
  message: string;
};

const handleAuthError = (error: AuthError): string => {
  const errorMessages: Record<string, string> = {
    "auth/claims-too-large": "The custom claims payload provided is too large.",
    "auth/email-already-exists": "The provided email is already in use by an existing user.",
    "auth/id-token-expired": "The provided Firebase ID token is expired.",
    "auth/id-token-revoked": "The Firebase ID token has been revoked.",
    "auth/invalid-argument": "An invalid argument was provided to an Authentication method.",
    "auth/invalid-claims": "The custom claim attributes provided are invalid.",
    "auth/invalid-creation-time": "The creation time must be a valid UTC date string.",
    "auth/invalid-disabled-field": "The disabled user property must be a boolean.",
    "auth/invalid-display-name": "The display name must be a non-empty string.",
    "auth/invalid-email-verified": "The email verified property must be a boolean.",
    "auth/invalid-email": "The email address is invalid.",
    "auth/invalid-password": "The password must be a string with at least 6 characters.",
    "auth/invalid-phone-number": "The phone number is invalid. It must be a non-empty E.164 standard compliant identifier string.",
    "auth/invalid-photo-url": "The photo URL must be a string URL.",
    "auth/invalid-uid": "The provided user ID is invalid. It must be a non-empty string with at most 128 characters.",
    "auth/missing-uid": "A user ID is required for the current operation.",
    "auth/operation-not-allowed": "The provided sign-in provider is disabled for your Firebase project.",
    "auth/phone-number-already-exists": "The provided phone number is already in use by an existing user.",
    "auth/project-not-found": "No Firebase project was found for the provided credentials.",
    "auth/too-many-requests": "The number of requests exceeds the maximum allowed.",
    "auth/uid-already-exists": "The provided user ID is already in use by an existing user.",
    "auth/user-not-found": "There is no user record corresponding to the provided identifier.",
    "auth/weak-password": "The password must be at least 6 characters long.",
    "auth/invalid-credential": "The provided credential are invalid. Please check Email and Password.",
    "auth/invalid-verification-code": "The verification code is invalid.",
    "auth/invalid-verification-id": "The verification ID is invalid.",
    "auth/missing-verification-code": "The verification code is missing.",
    "auth/missing-verification-id": "The verification ID is missing.",
    "auth/app-deleted": "This instance of FirebaseApp has been deleted.",
    "auth/account-exists-with-different-credential": "An account already exists with the same email address but different sign-in credentials.",
    "auth/network-request-failed": "A network error occurred. Please try again.",
    "auth/popup-blocked": "The popup was blocked by the browser.",
    "auth/popup-closed-by-user": "The popup was closed by the user before finalizing the operation.",
    "auth/unauthorized-domain": "The domain of the current URL is not authorized for OAuth operations.",
    "auth/invalid-action-code": "The action code is invalid. This can happen if the code is malformed or has already been used.",
    "auth/wrong-password": "The password is invalid.",
    "auth/invalid-persistence-type": "The specified persistence type is invalid.",
    "auth/unsupported-persistence-type": "The current environment does not support the specified persistence type.",
  };

  return errorMessages[error.code] || `Authentication error: ${error.message}`;
};

const createUserData = (user: User, fullName: string, phoneNumber: string): UserData => ({
  id: user.uid,
  fullName,
  email: user.email!,
  phoneNumber,
  watchedVideos: [],
});

const sendIdTokenToServer = async (user: User): Promise<void> => {
  const idToken = await user.getIdToken();
  const response = await fetch("/api/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
};

export const registerWithEmailAndPassword = async (
  email: string,
  password: string,
  fullName: string,
  phoneNumber: string
): Promise<User> => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    const userData = createUserData(user, fullName, phoneNumber);
    await setDoc(doc(db, "users", user.uid), userData);
    await sendIdTokenToServer(user);
    return user;
  } catch (error) {
    throw new Error(handleAuthError(error as AuthError));
  }
};

export const signInWithCredentials = async (email: string, password: string): Promise<User> => {
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
    await signOut(auth);
    await fetch("/api/signin", { method: "DELETE" });
  } catch (error) {
    throw new Error(handleAuthError(error as AuthError));
  }
};

export const signInAdmin = async (email: string, password: string): Promise<User> => {
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