<script lang="ts">
  import { getThumbnailUrl } from "$lib/utils";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { t, language } from "$lib/stores/language";
  import type { VideoData } from "$lib/types";
  import { VideoPlayer, Comments } from "$lib/components";

  $: videoKey = $page.params.videoId;

  let video: VideoData | null = null;
  let isLoading: boolean = true;
  let error: string = "";

  function getLocalizedContent(
    content: { en: string; ar: string },
    lang: string
  ): string {
    return lang === "ar" ? content.ar : content.en;
  }

  onMount(async () => {
    try {
      const response = await fetch(`/api/video-data/${videoKey}`);
      if (response.ok) {
        video = await response.json();
        // console.log("video on watch page", video);
      } else {
        error = $t("fetchVideoError");
      }
    } catch (err) {
      console.error("Error fetching video:", err);
      error = "Error Fetching Video";
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
{:else if error}
  <div class="alert alert-error shadow-lg">
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current flex-shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        /></svg
      >
      <span>{error}</span>
    </div>
  </div>
{:else if video}
  <h1 class="text-2xl font-bold">
    {video.title}
  </h1>
  <a href="https://reham.com/" class=""
    >Click here for femininity and self-love programs</a
  >
  <div class="mt-4">
    <VideoPlayer
      videoUrl={video.videoUrl}
      thumbnail={video.thumbnail}
      title={video.name}
    />
  </div>
  <div id="videoDesc" class="mt-4">
    <h2 class="text-xl font-semibold mb-2">{$t("description")}</h2>
    <p>{video.description}</p>
  </div>

  <Comments videoId={video.id} />
{/if}
