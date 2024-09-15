// routes/api/videos/+server.ts
import type { RequestHandler } from "@sveltejs/kit";
import {
  getAllVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  getVideoById,
} from "$lib/videoFirebase";
import type { Video } from "$lib/types";

export const GET: RequestHandler = async ({ url }) => {
  try {
    const id = url.searchParams.get("id");
    let data;

    if (id) {
      data = await getVideoById(id);
      if (!data) {
        return new Response(JSON.stringify({ error: "Video not found" }), {
          status: 404,
        });
      }
    } else {
      data = await getAllVideos();
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const videoData: Video = await request.json();
    const newVideo = await createVideo(videoData);
    return new Response(JSON.stringify(newVideo), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};

export const PUT: RequestHandler = async ({ request }) => {
  try {
    const { id, ...videoData } = await request.json();
    if (!id) {
      return new Response(JSON.stringify({ error: "Video ID is required" }), {
        status: 400,
      });
    }
    await updateVideo(id, videoData);
    const updatedVideo = await getVideoById(id);
    return new Response(JSON.stringify(updatedVideo), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};

export const DELETE: RequestHandler = async ({ request }) => {
  try {
    const { id } = await request.json();
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
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
