// $lib/videoFirebase.ts
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
import type { Video, VideoWithId } from "./types";

export async function createVideo(videoData: Video): Promise<VideoWithId> {
try {
  const docRef = await addDoc(collection(db, "videos"), videoData);
  return { ...videoData, id: docRef.id };
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
videoData: Partial<Video>
): Promise<void> {
try {
  const docRef = doc(db, "videos", id);
  await updateDoc(docRef, videoData);
} catch (error) {
  console.error("Error updating video:", error);
  throw new Error("Failed to update video");
}
}

export async function getVideoById(id: string): Promise<VideoWithId | null> {
try {
  const docRef = doc(db, "videos", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() as Video };
  } else {
    console.log("No such document!");
    return null;
  }
} catch (error) {
  console.error("Error getting video:", error);
  throw new Error("Failed to get video");
}
}

export async function getAllVideos(): Promise<VideoWithId[]> {
try {
  const videosCollection = collection(db, "videos");
  const q = query(videosCollection, orderBy("title"));
  const querySnapshot = await getDocs(q);

  const videos: VideoWithId[] = [];
  querySnapshot.forEach((doc) => {
    videos.push({ id: doc.id, ...doc.data() as Video });
  });

  return videos;
} catch (error) {
  console.error("Error getting all videos:", error);
  throw new Error("Failed to get videos");
}
}