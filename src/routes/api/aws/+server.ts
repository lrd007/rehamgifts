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

interface CacheEntry {
  data: VideoFileInfo[];
  timestamp: number;
}

const shortTermCache: { [key: string]: CacheEntry } = {};
const longTermCache: { [key: string]: CacheEntry } = {};
const SHORT_TERM_CACHE_DURATION = 10000; // 10 seconds in milliseconds
const LONG_TERM_CACHE_DURATION = 300000; // 5 minutes in milliseconds
const MAX_PARALLEL_REQUESTS = 10;
let isRefreshing = false;

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
  let idCounter = 1;

  try {
    let continuationToken: string | undefined;

    do {
      const params: AWS.S3.ListObjectsV2Request = {
        Bucket: bucketName,
        ContinuationToken: continuationToken,
        MaxKeys: 1000,
      };

      const response = await s3.listObjectsV2(params).promise();

      if (response.Contents) {
        const headPromises = response.Contents.map((item) => {
          if (item.Key && item.Size && item.LastModified) {
            const headParams: AWS.S3.HeadObjectRequest = {
              Bucket: bucketName,
              Key: item.Key,
            };
            return s3
              .headObject(headParams)
              .promise()
              .then((headResponse) => {
                if (
                  headResponse.ContentType &&
                  isVideoFile(headResponse.ContentType)
                ) {
                  return {
                    id: idCounter++,
                    name: getFileName(item.Key),
                    size: item.Size,
                    lastModified: item.LastModified,
                    contentType: headResponse.ContentType,
                  };
                }
                return null;
              })
              .catch(() => null);
          }
          return Promise.resolve(null);
        });

        for (let i = 0; i < headPromises.length; i += MAX_PARALLEL_REQUESTS) {
          const batch = headPromises.slice(i, i + MAX_PARALLEL_REQUESTS);
          const results = await Promise.all(batch);
          videoFiles.push(
            ...results.filter((item): item is VideoFileInfo => item !== null)
          );
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

async function refreshCache(bucketName: string): Promise<void> {
  if (isRefreshing) return;
  isRefreshing = true;

  try {
    console.log("Refreshing cache in background");
    const videoFiles = await getVideoFilesFromS3(bucketName);
    const now = Date.now();
    const cacheEntry: CacheEntry = { data: videoFiles, timestamp: now };

    const cacheKey = `videoFiles_${bucketName}`;
    shortTermCache[cacheKey] = cacheEntry;
    longTermCache[cacheKey] = cacheEntry;

    console.log("Cache refreshed successfully");
  } catch (error) {
    console.error("Error refreshing cache:", error);
  } finally {
    isRefreshing = false;
  }
}

async function getCachedVideoFiles(
  bucketName: string
): Promise<VideoFileInfo[]> {
  const now = Date.now();
  const cacheKey = `videoFiles_${bucketName}`;

  // Check short-term cache
  if (
    shortTermCache[cacheKey] &&
    now - shortTermCache[cacheKey].timestamp < SHORT_TERM_CACHE_DURATION
  ) {
    console.log("Returning short-term cached result");
    return shortTermCache[cacheKey].data;
  }

  // Check long-term cache
  if (
    longTermCache[cacheKey] &&
    now - longTermCache[cacheKey].timestamp < LONG_TERM_CACHE_DURATION
  ) {
    console.log(
      "Returning long-term cached result and refreshing in background"
    );
    // Trigger cache refresh in background
    refreshCache(bucketName).catch(console.error);
    return longTermCache[cacheKey].data;
  }

  // If no valid cache, fetch fresh data
  console.log("Fetching fresh data from S3");
  const videoFiles = await getVideoFilesFromS3(bucketName);

  const cacheEntry: CacheEntry = { data: videoFiles, timestamp: now };
  shortTermCache[cacheKey] = cacheEntry;
  longTermCache[cacheKey] = cacheEntry;

  return videoFiles;
}

export const GET: RequestHandler = async () => {
  try {
    const videoFiles = await getCachedVideoFiles(S3_BUCKET_NAME);
    return json(videoFiles);
  } catch (error) {
    console.error("Error in API route:", error);
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};
