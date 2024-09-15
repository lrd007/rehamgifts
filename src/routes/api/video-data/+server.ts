// routes/api/video-data/+server.ts
import type { RequestHandler } from "@sveltejs/kit";
import {
  getAllVideos,
  createVideo,
  updateVideo,
  deleteVideo,
} from "$lib/videoFirebase";
import type { Video } from "$lib/types";

export const GET: RequestHandler = async ({ url }) => {
  try {
    const lang = url.searchParams.get("lang") || "en";
    const videos = await getAllVideos();

    // console.log("getting all videos",{videos});

    return new Response(JSON.stringify(videos), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const videoData = await request.json();
    const newVideo = await createVideo(videoData);
    // console.log("newVideo", newVideo);
    return new Response(JSON.stringify(newVideo), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
