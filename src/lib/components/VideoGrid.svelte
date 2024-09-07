<script lang="ts">
  import { onMount } from "svelte";
  import VideoPlayer from "./VideoPlayer.svelte";

  interface VideoFileInfo {
    id: number;
    name: string;
    size: number;
    lastModified: Date;
    contentType: string;
  }

  let videos: VideoFileInfo[] = [];
  let isLoading: boolean = true;

  onMount(async () => {
    try {
      // Uncomment this block to fetch from API
      // const response = await fetch("/api/aws");
      // if (response.ok) {
      //   videos = await response.json();
      // } else {
      //   console.error("Failed to fetch video files");
      // }

      videos = [
        {
          id: 1,
          name: "6-Are you feminine or masculine.mp4",
          size: 69241577,
          lastModified: new Date("2024-09-07T14:19:37.000Z"),
          contentType: "video/mp4",
        },
        {
          id: 2,
          name: "4-emotional relationship feminine or masculine.mp4",
          size: 94927207,
          lastModified: new Date("2024-09-07T14:31:28.000Z"),
          contentType: "video/mp4",
        },
        {
          id: 3,
          name: "1-Free awareness video lesson.mp4",
          size: 86306669,
          lastModified: new Date("2024-09-07T14:19:37.000Z"),
          contentType: "video/mp4",
        },
        {
          id: 4,
          name: "5-Is motherhood feminine or masculine.mp4",
          size: 50001804,
          lastModified: new Date("2024-09-07T14:19:37.000Z"),
          contentType: "video/mp4",
        },
        {
          id: 5,
          name: "2-feminine luxury.mp4",
          size: 184001423,
          lastModified: new Date("2024-09-07T14:19:37.000Z"),
          contentType: "video/mp4",
        },
        {
          id: 6,
          name: "3-Is female or male leadership.mp4",
          size: 96180227,
          lastModified: new Date("2024-09-07T14:19:37.000Z"),
          contentType: "video/mp4",
        },
      ];

      // Sort videos by id to ensure consistent order
      videos.sort((a, b) => a.id - b.id);
      console.log(videos);
    } catch (error) {
      console.error("Error fetching video files:", error);
    } finally {
      isLoading = false;
    }
  });
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
  {#if isLoading}
    {#each Array(6) as _}
      <div class="card bg-base-200 shadow-xl animate-pulse">
        <div class="h-72 bg-base-300"></div>
        <div class="card-body">
          <div class="h-4 bg-base-300 rounded w-3/4"></div>
        </div>
      </div>
    {/each}
  {:else}
    {#each videos as video (video.id)}
      <div class="card bg-base-100 shadow-xl overflow-hidden">
        <figure class="relative">
          <VideoPlayer
            videoKey={video.name}
            dataVideoId={`video-${video.id}`}
          />
        </figure>
        <div class="card-body">
          <h2 class="card-title text-lg">{video.name}</h2>
        </div>
      </div>
    {/each}
  {/if}
</div>
