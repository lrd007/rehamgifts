<script lang="ts">
  import { base } from "$app/paths";
  import { user } from "$lib/stores/auth";
  import type { VideoWithId } from "$lib/types";
  import { t } from "$lib/stores/language";

  export let data: { videos: VideoWithId[] };
  $: videos = data.videos;
</script>

{#if videos.length === 0}
  <div class="text-xl whitespace-pre-line">{$t("noVideosMessage")}</div>
{:else}
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
    {#each videos as video (video.id)}
      <div class="card bg-base-100 shadow-xl overflow-hidden max-w-96 mx-auto">
        <figure class="relative">
          {#if !$user}
            <div
              class="absolute inset-0 flex items-center justify-center text-white font-bold bg-black bg-opacity-70"
            >
              <span>{$t("signInToWatch")}</span>
            </div>
          {/if}

          <a
            href={$user ? `${base}/program/${video.id}` : "#"}
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
          <h2 class="card-title text-lg">{video.title}</h2>
        </div>
      </div>
    {/each}
  </div>
{/if}
