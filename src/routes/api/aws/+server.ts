import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import path from "path";
import AWS from "aws-sdk";
import {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  S3_BUCKET_NAME,
} from "$env/static/private";

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

const s3 = new AWS.S3();

interface VideoFileInfo {
  id: number;
  name: string;
  size: number;
  lastModified: Date;
  contentType: string;
}

function isVideoFile(contentType: string): boolean {
  return (
    contentType.startsWith("video/") || contentType === "application/x-mpegURL"
  );
}

function getFileName(key: string): string {
  return path.basename(key);
}

async function getVideoFilesFromS3(
  bucketName: string
): Promise<VideoFileInfo[]> {
  const videoFiles: VideoFileInfo[] = [];
  let idCounter = 1; // Initialize the ID counter

  try {
    let continuationToken: string | undefined;

    do {
      const params: AWS.S3.ListObjectsV2Request = {
        Bucket: bucketName,
        ContinuationToken: continuationToken,
      };

      const response = await s3.listObjectsV2(params).promise();

      if (response.Contents) {
        for (const item of response.Contents) {
          if (item.Key && item.Size && item.LastModified) {
            const headParams: AWS.S3.HeadObjectRequest = {
              Bucket: bucketName,
              Key: item.Key,
            };
            const headResponse = await s3.headObject(headParams).promise();

            if (
              headResponse.ContentType &&
              isVideoFile(headResponse.ContentType)
            ) {
              videoFiles.push({
                id: idCounter++, // Assign and increment the ID
                name: getFileName(item.Key),
                size: item.Size,
                lastModified: item.LastModified,
                contentType: headResponse.ContentType,
              });
            }
          }
        }
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    return videoFiles;
  } catch (error) {
    console.error("Error fetching video files from S3:", error);
    throw error;
  }
}

export const GET: RequestHandler = async () => {
  try {
    const videoFiles = await getVideoFilesFromS3(S3_BUCKET_NAME);
    return json(videoFiles);
  } catch (error) {
    console.error("Error in API route:", error);
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};
