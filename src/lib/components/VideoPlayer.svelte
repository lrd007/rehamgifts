<script lang="ts">
  import { onMount } from "svelte";

  export let videoKey: string; // Accept videoKey as a prop

  let videoElement: HTMLVideoElement;
  let status: string = "Loading video...";

  onMount(() => {
    if (videoElement) {
      videoElement.src = `/api/get-video-url/${videoKey}`;
      videoElement.addEventListener("loadedmetadata", () => {
        status = "";
      });
      videoElement.addEventListener("error", () => {
        status = "Error loading video";
      });
    }
  });
</script>

<div>
  {#if status}
    <p id="status">{status}</p>
  {/if}
  <video bind:this={videoElement} controls>
    Your browser does not support the video tag.
  </video>
</div>

<style>
  video {
    max-width: 100%;
  }
</style>
