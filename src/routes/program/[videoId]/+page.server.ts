import type { PageServerLoad } from "./$types";
import { getVideoById, getAllVideos } from "$lib/videoFirebase";
import type { VideoWithId } from "$lib/types";

export const load: PageServerLoad = async ({ params }) => {
  const videoId = params.videoId;
  const video = await getVideoById(videoId);

  if (!video) {
    return {
      status: 404,
      error: new Error("Video not found"),
    };
  }

  // Fetch all videos to determine previous and next
  const allVideos = await getAllVideos();
  const sortedVideos = allVideos.sort((a, b) => a.order - b.order);
  const currentIndex = sortedVideos.findIndex((v) => v.id === videoId);

  const previousVideo: VideoWithId | null =
    currentIndex > 0 ? sortedVideos[currentIndex - 1] : null;
  const nextVideo: VideoWithId | null =
    currentIndex < sortedVideos.length - 1
      ? sortedVideos[currentIndex + 1]
      : null;

  return {
    video,
    previousVideoId: previousVideo?.id || null,
    nextVideoId: nextVideo?.id || null,
  };
};
