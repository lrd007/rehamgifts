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
      const response = await fetch("/api/aws");
      if (response.ok) {
        videos = await response.json();
        // Sort videos by id to ensure consistent order
        videos.sort((a, b) => a.id - b.id);
      } else {
        console.error("Failed to fetch video files");
      }
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
