import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  limit,
  Query,
  CollectionReference,
  Timestamp,
} from "firebase/firestore";

import { db } from "./firebase"; // Assuming you have this import from your existing code
import type { VideoComment } from "./components/constants";

// Create a new comment
export async function createComment(
  userId: string,
  userName: string,
  content: string,
  videoId: number
): Promise<VideoComment> {
  try {
    const commentData: Omit<VideoComment, "id"> = {
      userId,
      userName,
      content,
      videoId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, "comments"), commentData);
    return { ...commentData, id: docRef.id };
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
}

// Read a single comment by ID
export async function getCommentById(
  commentId: string
): Promise<VideoComment | null> {
  try {
    const docRef = doc(db, "comments", commentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as VideoComment;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting comment:", error);
    throw error;
  }
}

// Read comments with optional filtering and sorting
export async function getComments(options?: {
  userId?: string;
  videoId?: number;
  orderByField?: keyof VideoComment;
  orderDirection?: "asc" | "desc";
  limitTo?: number;
}): Promise<VideoComment[]> {
  try {
    let q: Query<VideoComment> = collection(
      db,
      "comments"
    ) as CollectionReference<VideoComment>;

    if (options?.userId) {
      q = query(q, where("userId", "==", options.userId));
    }

    if (options?.videoId !== undefined) {
      q = query(q, where("videoId", "==", options.videoId));
    }

    if (options?.orderByField) {
      q = query(
        q,
        orderBy(options.orderByField, options.orderDirection || "desc")
      );
    }

    if (options?.limitTo) {
      q = query(q, limit(options.limitTo));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting comments:", error);
    throw error;
  }
}

function convertTimestampToDate(timestamp: Timestamp | string): Date {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  } else if (typeof timestamp === "string") {
    // Remove the "at" and timezone information for easier parsing
    const cleanedDateString = timestamp.replace(" at ", " ").split(" UTC")[0];
    return new Date(cleanedDateString);
  }
  throw new Error("Invalid timestamp format");
}

// Get all comments for a specific videoId
export async function getCommentsByVideoId(
  videoId: number
): Promise<VideoComment[]> {
  try {
    const q = query(
      collection(db, "comments"),
      where("videoId", "==", videoId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: convertTimestampToDate(data.createdAt),
        updatedAt: convertTimestampToDate(data.updatedAt),
      } as VideoComment;
    });
  } catch (error) {
    console.error("Error getting comments for video:", error);
    throw error;
  }
}

// Update a comment
export async function updateComment(
  commentId: string,
  content: string
): Promise<void> {
  try {
    const docRef = doc(db, "comments", commentId);
    await updateDoc(docRef, {
      content,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
}

// Delete a comment
export async function deleteComment(commentId: string): Promise<void> {
  try {
    const docRef = doc(db, "comments", commentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}
