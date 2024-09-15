<!-- VideoGrid.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { base } from "$app/paths";
  import { user } from "$lib/stores/auth";
  import type { Video } from "$lib/types";
  import { language, t } from "$lib/stores/language";
  import { fetchVimeoData } from "$lib/services/vimeo";

  let videos: Video[] = [];
  let isLoading: boolean = true;

  async function fetchVideoData() {
    try {
      const response = await fetch(`/api/video-data`);
      if (response.ok) {
        videos = await response.json();
        await Promise.all(videos.map(fetchVimeoData));
      } else {
        console.error($t("fetchVideoError"));
      }
    } catch (error) {
      console.error($t("fetchVideoErrorWithDetails"), error);
    } finally {
      isLoading = false;
    }
  }

  onMount(fetchVideoData);
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
          {/if}

          <a
            href={$user ? `${base}/watch/${video.id}` : "#"}
            class="block"
            class:pointer-events-none={!$user}
            class:cursor-not-allowed={!$user}
          >
            {#if video.thumbnail}
              <img
                src={video.thumbnail}
                alt={video.title || $t("videoThumbnail")}
              />
            {:else}
              <div class="h-56 bg-base-300 flex items-center justify-center">
                <span>{$t("thumbnailLoading")}</span>
              </div>
            {/if}
          </a>
        </figure>
        <div class="card-body">
          <h2 class="card-title text-lg">{video.title || video.name}</h2>
          {#if video.description}
            <p class="text-sm text-gray-600 line-clamp-2">
              {video.description}
            </p>
          {/if}
        </div>
      </div>
    {/each}
  {/if}
</div>
