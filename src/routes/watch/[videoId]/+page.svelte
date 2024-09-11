<script lang="ts">
  import { getThumbnailUrl } from "$lib/components/utilities";
  import VideoPlayer from "$lib/components/VideoPlayer.svelte";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Comments from "$lib/components/Comments.svelte";
  import type { VideoFileInfo } from "$lib/components/constants";

  $: videoKey = $page.params.videoId;

  let video: VideoFileInfo;
  let isLoading: boolean = true;

  onMount(async () => {
    try {
      const response = await fetch(`/api/video-data/${videoKey}`);
      if (response.ok) {
        video = await response.json();
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

{#if isLoading}
  <div class="card bg-base-200 shadow-xl animate-pulse">
    <div class="h-56 bg-base-300 rounded-xl"></div>
    <div class="card-body h-28">
      <div class="h-6 bg-base-300 rounded w-3/4"></div>
    </div>
  </div>
{:else}
  <VideoPlayer videoKey={video.name} thumbnail={getThumbnailUrl(video.id)} />
  <div>
    {video.description}
  </div>

  <Comments videoId={video.id} />
{/if}
