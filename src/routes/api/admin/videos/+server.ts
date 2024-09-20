// src/routes/api/admin/videos/+server.ts
import { json, type RequestHandler } from "@sveltejs/kit";
import { db } from "$lib/client/firebase";
import { collection, getDocs } from "firebase/firestore";

export const GET: RequestHandler = async () => {
  const videosCollection = collection(db, "videos");
  const videoSnapshot = await getDocs(videosCollection);

  const videos = videoSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return json(videos);
};
