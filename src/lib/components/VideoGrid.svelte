<script lang="ts">
  import { user } from "$lib/firebase";
  import { onMount } from "svelte";

  interface Video {
    id: number;
    title: string;
    thumbnail: string;
  }

  let videos: Video[] = [];
  let isLoading: boolean = true;
  let isLoggedIn: boolean = false; // This should be set based on your auth logic

  onMount(async () => {
    // Simulate fetching videos from AWS
    await new Promise((resolve) => setTimeout(resolve, 1500));
    videos = [
      { id: 1, title: "Video 1", thumbnail: "/api/placeholder/300/200" },
      { id: 2, title: "Video 2", thumbnail: "/api/placeholder/300/200" },
      { id: 3, title: "Video 3", thumbnail: "/api/placeholder/300/200" },
      { id: 4, title: "Video 4", thumbnail: "/api/placeholder/300/200" },
      { id: 5, title: "Video 5", thumbnail: "/api/placeholder/300/200" },
      { id: 6, title: "Video 6", thumbnail: "/api/placeholder/300/200" },
    ];
    isLoading = false;
  });

  function playVideo(videoId: number): void {
    if ($user) {
      console.log(`Playing video ${videoId}`);
      // Implement your video playing logic here
    }
  }
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
  {#if isLoading}
    {#each Array(6) as _}
      <div class="card bg-base-200 shadow-xl animate-pulse">
        <div class="h-48 bg-base-300"></div>
        <div class="card-body">
          <div class="h-4 bg-base-300 rounded w-3/4"></div>
        </div>
      </div>
    {/each}
  {:else}
    {#each videos as video (video.id)}
      <div class="card bg-base-100 shadow-xl overflow-hidden">
        <figure class="relative">
          <img
            src={video.thumbnail}
            alt={video.title}
            class="w-full h-80 object-cover"
          />
          {#if !$user}
            <div
              class="absolute inset-0 bg-base-300 bg-opacity-75 flex items-center justify-center"
            >
              <span class="text-base-content font-semibold"
                >Sign in to watch</span
              >
            </div>
          {/if}
        </figure>
      </div>
    {/each}
  {/if}
</div>
