import type { Video } from "$lib/types";

export async function fetchVimeoData(video: Video) {
    try {
      const videoId = video.videoUrl.split("/").pop()?.split("?")[0];
      // console.log("fetching vimeo data for videoId", videoId);
      const response = await fetch(
        `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`
      );
      if (response.ok) {
        const data = await response.json();
        // console.log("Full Vimeo data for video", video.id, ":", data);

        video.thumbnail = data.thumbnail_url;
        video.title = data.title;
        video.description = data.description;
        // console.log("thumbnail, title, description", video.thumbnail, video.title, video.description);

        // You can add more fields here based on what's available in the Vimeo data
        // For example:
        // video.duration = data.duration;
        // video.uploadDate = data.upload_date;
        // etc.
        return video;
      }
    } catch (error) {
      console.error(`Error fetching Vimeo data for video ${video.id}:`, error);
    }
  }