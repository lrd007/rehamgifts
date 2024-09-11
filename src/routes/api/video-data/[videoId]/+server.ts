import type { RequestHandler } from "@sveltejs/kit";
import { videos } from "../video-data";

export const GET: RequestHandler = async ({ params, request }) => {
  const videoId = params.videoId;
  const foundVideo = videos.find(
    (each_video) => each_video.id.toString() === videoId
  );

  if (foundVideo === undefined) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
    });
  } else {
    console.log(foundVideo);
    return new Response(JSON.stringify(foundVideo), { status: 200 });
  }
};
