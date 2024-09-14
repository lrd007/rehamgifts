import type { RequestHandler } from "@sveltejs/kit";
import { deleteVideo, getVideoById, updateVideo } from "$lib/videoFirebase";

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
  try {
    const id = params.videoId;
    if (!id) {
      return new Response(JSON.stringify({ error: "Video ID is required" }), {
        status: 400,
      });
    }
    const video = await getVideoById(id);
    if (video) {
      return new Response(JSON.stringify(video), {
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
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
