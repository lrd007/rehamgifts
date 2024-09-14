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
import type { Video } from "./components/constants";
import { db } from "./client/firebase";


export async function createVideo(
  videoData: Omit<Video, "id">
): Promise<Video> {
  try {
    const processedVideoData = {
      ...videoData,
      lastModified: new Date(videoData.lastModified),
    };

    const docRef = await addDoc(collection(db, "videos"), processedVideoData);
    return { ...processedVideoData, id: docRef.id };
  } catch (error) {
    console.error("Error creating video:", error);
    throw error;
  }
}

export async function deleteVideo(id: string): Promise<void> {
  try {
    const docRef = doc(db, "videos", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting video:", error);
    throw error;
  }
}

export async function updateVideo(
  id: string,
  videoData: Partial<Omit<Video, "id">>
): Promise<void> {
  try {
    const docRef = doc(db, "videos", id);
    await updateDoc(docRef, {
      ...videoData,
      lastModified: new Date(),
    });
  } catch (error) {
    console.error("Error updating video:", error);
    throw error;
  }
}

export async function getVideoById(id: string): Promise<Video | null> {
  try {
    const docRef = doc(db, "videos", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as Omit<Video, "id">;
      return { ...data, id: docSnap.id };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting video:", error);
    throw error;
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
      videos.push({ ...data, id: doc.id });
    });

    return videos;
  } catch (error) {
    console.error("Error getting all videos:", error);
    throw error;
  }
}
