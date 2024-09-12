<!-- VideoGrid.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { base } from "$app/paths";
  import { user } from "$lib/firebase";
  import type { VideoFileInfo } from "./constants";
  import { getThumbnailUrl } from "./utilities";
  import { language, t } from "$lib/language";

  let videos: VideoFileInfo[] = [];
  let isLoading: boolean = true;

  onMount(async () => {
    try {
      const response = await fetch("/api/video-data");
      if (response.ok) {
        videos = await response.json();
      } else {
        console.error($t("fetchVideoError"));
      }
    } catch (error) {
      console.error($t("fetchVideoErrorWithDetails"), error);
    } finally {
      isLoading = false;
    }
  });

  // Add a reactive statement to refetch data when language changes
  $: {
    if (!isLoading) {
      fetch(`/api/video-data?lang=${$language}`)
        .then((response) => response.json())
        .then((data) => {
          videos = data;
        })
        .catch((error) => {
          console.error($t("fetchVideoErrorWithDetails"), error);
        });
    }
  }
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
              <span>{$t("signInToWatch")}</span>
            </div>
            <img src={getThumbnailUrl(video.id)} alt={$t("videoThumbnail")} />
          {:else}
            <a href="{base}/watch/{video.id}">
              <img src={getThumbnailUrl(video.id)} alt={$t("videoThumbnail")} />
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
