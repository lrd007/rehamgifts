// routes/api/video-data/[videoId]/+server.ts
import type { RequestHandler } from "@sveltejs/kit";
import { deleteVideo, getVideoById, updateVideo } from "$lib/videoFirebase";
import { fetchVimeoData } from "$lib/services/vimeo";

export const PUT: RequestHandler = async ({ params, request }) => {
  try {
    const id = params.videoId;
    if (!id) {
      return new Response(JSON.stringify({ error: "Video ID is required" }), {
        status: 400,
      });
    }
    const videoData = await request.json();
    await updateVideo(id, videoData);
    const updatedVideo = await getVideoById(id);
    return new Response(JSON.stringify(updatedVideo), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};

export const DELETE: RequestHandler = async ({ params }) => {
  try {
    const id = params.videoId;
    if (!id) {
      return new Response(JSON.stringify({ error: "Video ID is required" }), {
        status: 400,
      });
    }
    await deleteVideo(id);
    return new Response(
      JSON.stringify({ message: "Video deleted successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};

export const GET: RequestHandler = async ({ params }) => {
  console.log("getting video by id", params.videoId);
  try {
    const id = params.videoId;
    if (!id) {
      return new Response(JSON.stringify({ error: "Video ID is required" }), {
        status: 400,
      });
    }
    const video = await getVideoById(id);
    // console.log("got video", video);
    if (video) {
      // console.log("got video without vimeo data", video);
      const videoWithVimeoData = await fetchVimeoData(video);
      console.log("got video with vimeo data", video);
      return new Response(JSON.stringify(videoWithVimeoData), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new Response(JSON.stringify({ error: "Video not found" }), {
        status: 404,
      });
    }
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
