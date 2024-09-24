<!-- VideoList.svelte -->
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { VideoWithId } from "$lib/types";
  import VideoItem from "./VideoItem.svelte";

  export let videosData: VideoWithId[] = [];

  const dispatch = createEventDispatcher();

  function handleVideoUpdate(event: CustomEvent<VideoWithId>) {
    dispatch("videoUpdated", event.detail);
  }

  function handleVideoDelete(event: CustomEvent<string>) {
    dispatch("videoDeleted", event.detail);
  }
</script>

<div class="overflow-x-auto">
  <table class="table w-full">
    <thead>
      <tr>
        <th>Title</th>
        <th>Description</th>
        <th>Video URL</th>
        <th>Thumbnail URL</th>
        <th>Order</th>
        <th>Active</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each videosData as video (video.id)}
        <VideoItem
          {video}
          on:videoUpdated={handleVideoUpdate}
          on:videoDeleted={handleVideoDelete}
        />
      {/each}
    </tbody>
  </table>
</div>
