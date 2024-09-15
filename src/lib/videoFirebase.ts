// lib/videoFirebase.ts
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./client/firebase";

export interface Video {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  videoUrl: string;
  description?: {
    en: string;
    ar: string;
  };
  thumbnail?: string;
  title?: string;
  lastModified: Date;
  size?: number;
  contentType?: string;
}

export async function createVideo(
  videoData: Omit<Video, "id" | "lastModified">
): Promise<Video> {
  try {
    const processedVideoData = {
      ...videoData,
      lastModified: new Date(),
    };

    const docRef = await addDoc(collection(db, "videos"), processedVideoData);
    return { ...processedVideoData, id: docRef.id };
  } catch (error) {
    console.error("Error creating video:", error);
    throw new Error("Failed to create video");
  }
}

export async function deleteVideo(id: string): Promise<void> {
  try {
    const docRef = doc(db, "videos", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting video:", error);
    throw new Error("Failed to delete video");
  }
}

export async function updateVideo(
  id: string,
  videoData: Partial<Omit<Video, "id" | "lastModified">>
): Promise<void> {
  try {
    const docRef = doc(db, "videos", id);
    await updateDoc(docRef, {
      ...videoData,
      lastModified: new Date(),
    });
  } catch (error) {
    console.error("Error updating video:", error);
    throw new Error("Failed to update video");
  }
}

export async function getVideoById(id: string): Promise<Video | null> {
  try {
    const docRef = doc(db, "videos", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as Omit<Video, "id">;
      return {
        ...data,
        id: docSnap.id,
        lastModified: data.lastModified.toDate(),
      };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting video:", error);
    throw new Error("Failed to get video");
  }
}

export async function getAllVideos(): Promise<Video[]> {
  try {
    const videosCollection = collection(db, "videos");
    const q = query(videosCollection, orderBy("lastModified", "desc"));
    const querySnapshot = await getDocs(q);

    const videos: Video[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Video, "id">;
      videos.push({
        ...data,
        id: doc.id,
        lastModified: data.lastModified.toDate(),
      });
    });

    return videos;
  } catch (error) {
    console.error("Error getting all videos:", error);
    throw new Error("Failed to get videos");
  }
}
