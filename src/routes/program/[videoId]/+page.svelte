<script lang="ts">
  import { t } from "$lib/stores/language";
  import type { VideoWithId } from "$lib/types";
  import { VideoPlayer, Comments } from "$lib/components";
  import { Carta, Markdown } from "carta-md";
  import DOMPurify from "dompurify";
  import { base } from "$app/paths";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  export let data: {
    video: VideoWithId;
    previousVideoId: string | null;
    nextVideoId: string | null;
  };

  const carta = new Carta({
    sanitizer: DOMPurify.sanitize,
  });

  $: ({ video, previousVideoId, nextVideoId } = data);
  $: value = video?.description ?? "";

  let isMobile = false;

  $: if (browser) {
    isMobile = window.matchMedia("(max-width: 768px)").matches;
  }

  onMount(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      isMobile = event.matches;
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  });
</script>

{#if !video}
  <div class="alert alert-error">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="stroke-current shrink-0 h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      /></svg
    >
    <span>{$t("fetchVideoError")}</span>
  </div>
{:else}
  <h1 class="text-3xl font-bold mb-4">
    {video.title}
  </h1>
  <a
    href="https://reham.com/"
    class="text-xl text-primary hover:underline mb-4 inline-block"
  >
    {$t("callToActionLink")}
  </a>

  <div class="mt-4 relative">
    <VideoPlayer
      videoUrl={video.url}
      thumbnail={video.thumbnail}
      title={video.title}
    />

    {#if !isMobile}
      <div
        class="absolute inset-0 flex items-center justify-between px-4 pointer-events-none"
      >
        {#if previousVideoId}
          <a
            href="{base}/program/{previousVideoId}"
            class="btn btn-circle btn-outline btn-primary btn-lg opacity-50 hover:opacity-100 transition-opacity duration-300 pointer-events-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </a>
        {/if}
        {#if nextVideoId}
          <a
            href="{base}/program/{nextVideoId}"
            class="btn btn-circle btn-outline btn-primary btn-lg opacity-50 hover:opacity-100 transition-opacity duration-300 pointer-events-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        {/if}
      </div>
    {/if}
  </div>

  {#if isMobile}
    <div class="flex justify-between mt-4">
      <a
        href="{base}/program/{previousVideoId}"
        class="btn btn-primary"
        class:btn-disabled={!previousVideoId}
      >
        {$t("previous")}
      </a>
      <a
        href="{base}/program/{nextVideoId}"
        class="btn btn-primary"
        class:btn-disabled={!nextVideoId}
      >
        {$t("next")}
      </a>
    </div>
  {/if}

  <div class="mt-4">
    <h2 class="text-xl font-semibold mb-2">{$t("description")}</h2>
    <Markdown {carta} {value} />
  </div>

  <Comments videoId={video.id} />
{/if}
