import type { PageServerLoad } from "./$types";
import { getCommentsByVideoId } from "$lib/services/comments";
import type {
  VideoComment,
  VideoWithId,
  SerializedVideoComment,
} from "$lib/types";
import { error } from "@sveltejs/kit";
import { Timestamp } from "firebase/firestore";

function serializeComment(comment: VideoComment): SerializedVideoComment {
  return {
    ...comment,
    createdAt: comment.createdAt.toDate().toISOString(),
    updatedAt: comment.updatedAt.toDate().toISOString(),
  };
}

export const load: PageServerLoad = async ({ params, parent }) => {
  try {
    const { videos } = await parent();
    const currentVideoId = params.videoId;

    const sortedVideos = [...videos].sort((a, b) => a.order - b.order);
    const currentIndex = sortedVideos.findIndex((v) => v.id === currentVideoId);
    const currentVideo = sortedVideos[currentIndex];

    if (!currentVideo) {
      throw error(404, "Video not found");
    }

    const previousVideo =
      currentIndex > 0 ? sortedVideos[currentIndex - 1] : null;
    const nextVideo =
      currentIndex < sortedVideos.length - 1
        ? sortedVideos[currentIndex + 1]
        : null;

    const { comments } = await getCommentsByVideoId(currentVideoId);
    const serializedComments = comments.map(serializeComment);

    return {
      video: currentVideo,
      previousVideoId: previousVideo?.id || null,
      nextVideoId: nextVideo?.id || null,
      allVideos: sortedVideos,
      comments: serializedComments,
      videoId: currentVideoId,
    };
  } catch (err) {
    console.error("Error in load function:", err);
    throw error(500, "An error occurred while loading the video data");
  }
};
