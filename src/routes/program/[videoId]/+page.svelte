<!-- /program/[videoId]/+page.svelte -->
<script lang="ts">
  import { t } from "$lib/stores/language";
  import type { VideoWithId } from "$lib/types";
  import { VideoPlayer, Comments } from "$lib/components";
  import { Carta, Markdown } from "carta-md";
  import DOMPurify from "dompurify";

  export let data: { video: VideoWithId };

  const carta = new Carta({
    sanitizer: DOMPurify.sanitize,
  });
  let value = "";

  $: ({ video } = data);
  $: value = video?.description || "";
</script>

{#if !video}
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
      <span>{$t("fetchVideoError")}</span>
    </div>
  </div>
{:else}
  <h1 class="text-3xl font-bold">
    {video.title}
  </h1>
  <a href="https://reham.com/" class="text-xl text-blue-500 hover:underline"
    >{$t("callToActionLink")}</a
  >
  <div class="mt-4">
    <VideoPlayer
      videoUrl={video.url}
      thumbnail={video.thumbnail}
      title={video.title}
    />
  </div>
  <div id="videoDesc" class="mt-4">
    <h2 class="text-xl font-semibold mb-2">{$t("description")}</h2>
    <Markdown {carta} {value} />
  </div>

  <Comments videoId={video.id} />
{/if}
