import { error } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import {
  CLOUDFRONT_DOMAIN,
  CLOUDFRONT_KEY_PAIR_ID,
  CLOUDFRONT_PRIVATE_KEY,
} from "$env/static/private";

import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

function getEncodedVideoUrl(filename: string): string {
  // Encode the filename, preserving spaces
  const encodedFilename = encodeURIComponent(filename).replace(/%20/g, " ");

  // Construct the full URL using SvelteKit's base path
  return `https://${CLOUDFRONT_DOMAIN}/${encodedFilename}`;
}

export const GET: RequestHandler = async ({ params, request }) => {
  const key = params.key;
  const range = request.headers.get("range");
  // console.log(key);

  if (!key) {
    throw error(400, "Video key is required");
  }

  try {
    const filename = "6-Are you feminine or masculine.mp4";
    const cloudfrontUrl = getEncodedVideoUrl(filename);
    // const encodedKey = encodeURIComponent(key);
    // const cloudfrontUrl = `https://${CLOUDFRONT_DOMAIN}/${encodedKey}`;

    // Generate a signed URL that's valid for 1 hour
    const signedUrl = getSignedUrl({
      url: cloudfrontUrl,
      keyPairId: CLOUDFRONT_KEY_PAIR_ID,
      privateKey: CLOUDFRONT_PRIVATE_KEY,
      dateLessThan: new Date(Date.now() + 3600000).toISOString(), // Current time + 1 hour
    });

    // Fetch headers from CloudFront
    const headResponse = await fetch(signedUrl, { method: "HEAD" });
    const contentLength = headResponse.headers.get("Content-Length");
    const contentType = headResponse.headers.get("Content-Type");

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1]
        ? parseInt(parts[1], 10)
        : parseInt(contentLength, 10) - 1;

      const chunkSize = end - start + 1;

      const response = await fetch(signedUrl, {
        headers: { Range: `bytes=${start}-${end}` },
      });

      return new Response(response.body, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${contentLength}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize.toString(),
          "Content-Type": contentType,
        },
      });
    } else {
      const response = await fetch(signedUrl);

      return new Response(response.body, {
        status: 200,
        headers: {
          "Content-Length": contentLength,
          "Content-Type": contentType,
        },
      });
    }
  } catch (err) {
    console.error("Error:", err);
    throw error(500, "Internal Server Error");
  }
};
