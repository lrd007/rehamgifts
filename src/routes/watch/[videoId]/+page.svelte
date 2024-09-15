<!-- routes/watch/[videoId]/+page.svelte -->
<script lang="ts">
  import { getThumbnailUrl } from "$lib/utils";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { t, language } from "$lib/stores/language";
  import type { Video } from "$lib/types";
  import { VideoPlayer, Comments } from "$lib/components";

  $: videoKey = $page.params.videoId;

  let video: Video | null = null;
  let isLoading: boolean = true;
  let error: string = "";

  async function fetchVimeoData(video: Video) {
    try {
      const videoId = video.videoUrl.split("/").pop()?.split("?")[0];
      const response = await fetch(
        `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`
      );
      if (response.ok) {
        const data = await response.json();
        video.thumbnail = data.thumbnail_url;
        video.title = data.title;
        video.description = data.description;
      }
    } catch (error) {
      console.error(`Error fetching Vimeo data for video ${video.id}:`, error);
    }
  }

  onMount(async () => {
    try {
      const response = await fetch(`/api/video-data/${videoKey}`);
      if (response.ok) {
        video = await response.json();
        await fetchVimeoData(video);
      } else {
        error = $t("fetchVideoError");
      }
    } catch (err) {
      console.error($t("fetchVideoErrorWithDetails"), err);
      error = $t("fetchVideoError");
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
  <h1 class="text-2xl font-bold mb-2">
    {video.title || (video.name && video.name[$language]) || $t("videoTitle")}
  </h1>

  <div class="mt-4">
    <VideoPlayer
      videoUrl={video.videoUrl}
      thumbnail={video.thumbnail || getThumbnailUrl(video.id)}
      title={video.title ||
        (video.name && video.name[$language]) ||
        $t("videoTitle")}
    />
  </div>

  <div id="videoDesc" class="mt-4">
    <h2 class="text-xl font-semibold mb-2">{$t("description")}</h2>
    <p>
      {video.description ||
        (video.description && video.description[$language]) ||
        $t("noDescription")}
    </p>
  </div>

  <a href="https://reham.com/" class="mt-4 block text-blue-500 hover:underline"
    >{$t("feminityProgramLink")}</a
  >

  <Comments videoId={video.id} />
{/if}
