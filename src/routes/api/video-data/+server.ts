import type { RequestHandler } from "@sveltejs/kit";
import { error } from "@sveltejs/kit";
import { videos } from "./video-data";

export const GET: RequestHandler = async ({}) => {
  return new Response(JSON.stringify(videos), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
