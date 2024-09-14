// routes/api/video-data/+server.ts
import type { RequestHandler } from "@sveltejs/kit";
import { createVideo, getAllVideos } from "$lib/videoFirebase";

// export const GET: RequestHandler = async ({ url }) => {
//   const lang = url.searchParams.get("lang") || "en";

//   const translatedVideos = videos.map((video) => ({
//     ...video,
//     displayName: video.displayName[lang as "en" | "ar"],
//     description: video.description[lang as "en" | "ar"],
//   }));

//   return new Response(JSON.stringify(translatedVideos), {
//     status: 200,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// };

export const POST: RequestHandler = async ({ request }) => {
  try {
    const videoData = await request.json();
    const newVideo = await createVideo(videoData);
    return new Response(JSON.stringify(newVideo), {
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

export const GET: RequestHandler = async () => {
  try {
    const videos = await getAllVideos();
    return new Response(JSON.stringify(videos), {
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
