// routes/api/video-data/+server.ts
import type { RequestHandler } from "@sveltejs/kit";
import { videos } from "./video-data";

export const GET: RequestHandler = async ({ url }) => {
  const lang = url.searchParams.get("lang") || "en";

  const translatedVideos = videos.map((video) => ({
    ...video,
    displayName: video.displayName[lang as "en" | "ar"],
    description: video.description[lang as "en" | "ar"],
  }));

  return new Response(JSON.stringify(translatedVideos), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
