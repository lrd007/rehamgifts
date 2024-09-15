import type { PageServerLoad } from './$types';
import { getVideoById } from "$lib/videoFirebase";

export const load: PageServerLoad = async ({ params }) => {
  const videoId = params.videoId;
  const video = await getVideoById(videoId);
  
  if (!video) {
    return {
      status: 404,
      error: new Error('Video not found')
    };
  }

  return {
    video
  };
};