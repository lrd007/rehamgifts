// $lib/services/comments.ts
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
} from "firebase/firestore";

import { db } from "../client/firebase";
import type { VideoComment } from "../types";
import { convertTimestampToDate } from "../utils/date";

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
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
      } as VideoComment;
    });
  } catch (error) {
    console.error("Error getting comments:", error);
    throw error;
  }
}

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

export async function deleteComment(commentId: string): Promise<void> {
  try {
    const docRef = doc(db, "comments", commentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}
