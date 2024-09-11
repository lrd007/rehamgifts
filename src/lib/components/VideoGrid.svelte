<!-- VideoGrid.svelte\ -->
<script lang="ts">
  import { onMount } from "svelte";
  import { base } from "$app/paths";
  import { user } from "$lib/firebase";
  import { getThumbnailUrl } from "$lib/components/utilities";

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

      const response = await fetch("/api/video-data");
      if (response.ok) {
        videos = await response.json();
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
        <div class="h-56 bg-base-300 rounded-xl"></div>
        <div class="card-body h-28">
          <div class="h-6 bg-base-300 rounded w-3/4"></div>
        </div>
      </div>
    {/each}
  {:else}
    {#each videos as video (video.id)}
      <div class="card bg-base-100 shadow-xl overflow-hidden">
        <figure class="relative">
          {#if !$user}
            <div
              class="absolute inset-0 flex items-center justify-center text-white font-bold bg-black bg-opacity-70"
            >
              <span>Sign in to watch</span>
            </div>
            <img src={getThumbnailUrl(video.id)} />
          {:else}
            <a href="{base}/watch/{video.id}">
              <img src={getThumbnailUrl(video.id)} />
            </a>
          {/if}
        </figure>
        <div class="card-body">
          <h2 class="card-title text-lg">{video.displayName}</h2>
        </div>
      </div>
    {/each}
  {/if}
</div>
