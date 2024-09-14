<!-- VideoProgress.svelte -->
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";

  export let watchedVideos: number[] = [];

  const dispatch = createEventDispatcher();

  const videos = [
    { id: 1, name: "1-Free awareness video lesson" },
    { id: 2, name: "2-feminine luxury" },
    { id: 3, name: "3-Is female or male leadership" },
    { id: 4, name: "4-emotional relationship feminine or masculine" },
    { id: 5, name: "5-Is motherhood feminine or masculine" },
    { id: 6, name: "6-Are you feminine or masculine" },
  ];

  function toggleVideoWatched(videoId: number) {
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
            <span class="label-text">{video.name}</span>
          </label>
        </li>
      {/each}
    </ul>
  </div>
</div>
