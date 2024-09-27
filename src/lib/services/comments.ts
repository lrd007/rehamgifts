import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteField,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../client/firebase";
import type { VideoComment, VideoComments } from "../types";

export async function createComment(
  videoId: string,
  userId: string,
  userName: string,
  content: string
): Promise<VideoComment> {
  try {
    const commentId = Date.now().toString();
    const now = serverTimestamp();
    const commentData: VideoComment = {
      id: commentId,
      userId,
      userName,
      content,
      createdAt: now as Timestamp,
      updatedAt: now as Timestamp,
    };

    const videoCommentsRef = doc(db, "comments", videoId);
    await setDoc(
      videoCommentsRef,
      {
        [commentId]: commentData,
      },
      { merge: true }
    );

    return commentData;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
}

export async function getCommentsByVideoId(
  videoId: string
): Promise<{ comments: VideoComment[]; totalCount: number }> {
  try {
    const videoCommentsRef = doc(db, "comments", videoId);
    const docSnap = await getDoc(videoCommentsRef);

    if (docSnap.exists()) {
      const comments: VideoComments = docSnap.data() as VideoComments;
      const commentArray = Object.values(comments).sort(
        (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
      );
      return {
        comments: commentArray,
        totalCount: commentArray.length,
      };
    } else {
      return { comments: [], totalCount: 0 };
    }
  } catch (error) {
    console.error("Error getting comments for video:", error);
    throw error;
  }
}

export async function deleteComment(
  videoId: string,
  commentId: string
): Promise<void> {
  try {
    const videoCommentsRef = doc(db, "comments", videoId);
    await updateDoc(videoCommentsRef, {
      [commentId]: deleteField(),
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}
