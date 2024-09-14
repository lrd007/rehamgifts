import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../client/firebase";
import type { UserData } from "../types";

export async function getUserData(userId: string): Promise<UserData | null> {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() } as UserData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

export async function updateUserData(
  userId: string,
  data: Partial<UserData>
): Promise<void> {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, data);
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
}
