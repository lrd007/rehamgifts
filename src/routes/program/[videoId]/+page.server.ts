// /program/[videoId]/+page.server.ts
import type { PageServerLoad } from "./$types";
import { getCommentsByVideoId } from "$lib/services/comments";
import type { VideoComment, SerializedVideoComment } from "$lib/types";

function serializeComment(comment: VideoComment): SerializedVideoComment {
  return {
    ...comment,
    createdAt: comment.createdAt.toDate().toISOString(),
    updatedAt: comment.updatedAt.toDate().toISOString(),
  };
}

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

  let comments: SerializedVideoComment[] = [];
  try {
    const result = await getCommentsByVideoId(currentVideoId);
    comments = result.comments.map(serializeComment);
  } catch (error) {
    console.error("Error fetching comments:", error);
  }

  return {
    video: currentVideo,
    previousVideoId: previousVideo?.id || null,
    nextVideoId: nextVideo?.id || null,
    allVideos: sortedVideos,
    comments,
    videoId: currentVideoId,
  };
};
