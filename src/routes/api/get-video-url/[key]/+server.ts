import { error } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  S3_BUCKET_NAME,
} from "$env/static/private";

import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

const s3 = new AWS.S3();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

export const GET: RequestHandler = async ({ params, request }) => {
  const key = params.key;
  const range = request.headers.get("range");

  if (!key) {
    throw error(400, "Video key is required");
  }

  try {
    const { ContentLength, ContentType } = await s3
      .headObject({
        Bucket: S3_BUCKET_NAME,
        Key: key,
      })
      .promise();

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : ContentLength - 1;

      const chunkSize = end - start + 1;

      const stream = s3
        .getObject({
          Bucket: S3_BUCKET_NAME,
          Key: key,
          Range: `bytes=${start}-${end}`,
        })
        .createReadStream();

      return new Response(stream, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${ContentLength}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize.toString(),
          "Content-Type": ContentType,
        },
      });
    } else {
      const stream = s3
        .getObject({
          Bucket: S3_BUCKET_NAME,
          Key: key,
        })
        .createReadStream();

      return new Response(stream, {
        status: 200,
        headers: {
          "Content-Length": ContentLength.toString(),
          "Content-Type": ContentType,
        },
      });
    }
  } catch (err) {
    console.error("Error:", err);
    throw error(500, "Internal Server Error");
  }
};
