import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import AWS from "aws-sdk";
import {AWS_ACCESS_KEY,AWS_SECRET_ACCESS_KEY,AWS_REGION} from "$env/static/private"

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

const s3 = new AWS.S3();

export const GET: RequestHandler = async ({ request }) => {
  const range = request.headers.get("range");
  const fileKey = "5th.mp4"; // Change this to your video file key
  const bucketName = "jordon-project";
  const headParams: AWS.S3.HeadObjectRequest = {
    Bucket: bucketName,
    Key: fileKey,
  };

  try {
    const headData = await s3.headObject(headParams).promise();
    const fileSize = headData.ContentLength;

    if (!fileSize) {
      throw error(404, "File not found or empty");
    }

    if (range) {
      let [startStr, endStr] = range.replace(/bytes=/, "").split("-");
      let start = parseInt(startStr, 10);
      let end = endStr ? parseInt(endStr, 10) : fileSize - 1;
      // console.log({start, end})

      // Handle potential issues with start and end
      if (isNaN(start)) {
        start = 0;
      }
      if (isNaN(end) || end >= fileSize) {
        end = fileSize - 1;
      }
      if (start >= fileSize || start > end || start < 0) {
        throw error(416, "Requested range not satisfiable");
      }

      const contentLength = end - start + 1;

      const params: AWS.S3.GetObjectRequest = {
        Bucket: bucketName,
        Key: fileKey,
        Range: `bytes=${start}-${end}`,
      };

      const data = await s3.getObject(params).promise();
      const headers = new Headers({
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength.toString(),
        "Content-Type": "video/mp4",
      });
      // console.log(headers)

      return new Response(data.Body as BodyInit, {
        status: 206,
        headers: headers,
      });
    } else {
      // If no range is specified, return the whole file
      const params: AWS.S3.GetObjectRequest = {
        Bucket: bucketName,
        Key: fileKey,
      };

      const data = await s3.getObject(params).promise();
      const headers = new Headers({
        "Content-Length": fileSize.toString(),
        "Content-Type": "video/mp4",
      });

      return new Response(data.Body as BodyInit, {
        status: 200,
        headers: headers,
      });
    }
  } catch (err) {
    console.error("Error:", err);
    throw error(500, (err as Error).message);
  }
};
