<!-- VideoProgress.svelte -->
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import type { VideoWithId } from "$lib/types";

  export let watchedVideos: string[] = [];
  export let videos: VideoWithId[] = [];

  const dispatch = createEventDispatcher();

  function toggleVideoWatched(videoId: string) {
    const isWatched = !watchedVideos.includes(videoId);
    dispatch("toggleVideo", { videoId, isWatched });
  }
</script>

<div class="card bg-base-100 shadow-xl" transition:fade>
  <div class="card-body">
    <h2 class="card-title mb-4">Video Progress</h2>
    <ul class="space-y-2">
      {#each videos as video (video.id)}
        <li>
          <label class="label cursor-pointer justify-start gap-4">
            <input
              type="checkbox"
              class="checkbox checkbox-primary"
              checked={watchedVideos.includes(video.id)}
              on:change={() => toggleVideoWatched(video.id)}
            />
            <span class="label-text">{video.title}</span>
          </label>
        </li>
      {/each}
    </ul>
  </div>
</div>
