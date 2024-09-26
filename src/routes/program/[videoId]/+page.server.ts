import type { PageServerLoad } from "./$types";
import type { VideoWithId } from "$lib/types";

export const load: PageServerLoad = async ({ params, parent }) => {
  const { videos } = await parent();
  const currentVideoId = params.videoId;

  const sortedVideos = [...videos].sort((a, b) => a.order - b.order);
  const currentIndex = sortedVideos.findIndex((v) => v.id === currentVideoId);
  const currentVideo = sortedVideos[currentIndex];

  if (!currentVideo) {
    return {
      status: 404,
      error: new Error("Video not found"),
    };
  }

  const previousVideo =
    currentIndex > 0 ? sortedVideos[currentIndex - 1] : null;
  const nextVideo =
    currentIndex < sortedVideos.length - 1
      ? sortedVideos[currentIndex + 1]
      : null;

  return {
    video: currentVideo,
    previousVideoId: previousVideo?.id || null,
    nextVideoId: nextVideo?.id || null,
    allVideos: sortedVideos,
  };
};
