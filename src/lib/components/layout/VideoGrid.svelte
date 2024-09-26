<script lang="ts">
  import { base } from "$app/paths";
  import { user } from "$lib/stores/auth";
  import type { VideoWithId } from "$lib/types";
  import { t } from "$lib/stores/language";
  import { fade } from "svelte/transition";

  export let videos: VideoWithId[];

  // Sort videos based on the 'order' field
  $: sortedVideos = [...videos].sort((a, b) => a.order - b.order);
</script>

{#if videos.length === 0}
  <div class="alert alert-info" transition:fade>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      class="stroke-current shrink-0 w-6 h-6"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path></svg
    >
    <span>{$t("noVideosMessage")}</span>
  </div>
{:else}
  <div class="flex flex-wrap justify-center gap-6">
    {#each sortedVideos as video (video.id)}
      <div
        class="card w-96 bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
        transition:fade
      >
        <figure class="relative h-60">
          {#if !$user}
            <div
              class="absolute inset-0 flex items-center justify-center bg-base-300 bg-opacity-75 z-10"
            >
              <span class="badge badge-lg">{$t("signInToWatch")}</span>
            </div>
          {/if}

          <a
            href={$user ? `${base}/program/${video.id}` : "#"}
            class="block w-full h-full"
            class:pointer-events-none={!$user}
            class:cursor-not-allowed={!$user}
          >
            {#if video.thumbnail}
              <img
                src={video.thumbnail}
                alt={video.title || $t("videoThumbnail")}
                class="w-full h-full object-cover"
                loading="lazy"
              />
            {:else}
              <div class="skeleton w-full h-full"></div>
            {/if}
          </a>
        </figure>
        <div class="card-body">
          <h2 class="card-title text-lg">{video.title}</h2>
        </div>
      </div>
    {/each}
  </div>
{/if}
