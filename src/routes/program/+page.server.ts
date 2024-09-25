// /program/+page.server.ts
import type { PageServerLoad } from "./$types";
import type { VideoWithId } from "$lib/types";

export const load: PageServerLoad = async ({ fetch }) => {
  try {
    const response = await fetch("/api/videos");
    if (response.ok) {
      const videos: VideoWithId[] = await response.json();
      return { videos };
    } else {
      console.error("Failed to fetch videos");
      return { videos: [] };
    }
  } catch (error) {
    console.error("Error fetching videos:", error);
    return { videos: [] };
  }
};
