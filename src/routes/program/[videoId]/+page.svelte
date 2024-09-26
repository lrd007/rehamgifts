<script lang="ts">
  import { t } from "$lib/stores/language";
  import type {
    SerializedVideoComment,
    VideoComment,
    VideoWithId,
  } from "$lib/types";
  import { VideoPlayer, Comments } from "$lib/components";
  import { Carta, Markdown } from "carta-md";
  import DOMPurify from "dompurify";
  import { base } from "$app/paths";
  import { goto, invalidate } from "$app/navigation";
  import { page } from "$app/stores";
  import { Timestamp } from "firebase/firestore";

  export let data: {
    comments: VideoComment[];
    videoId: string;
    video: VideoWithId;
    previousVideoId: string | null;
    nextVideoId: string | null;
    allVideos: VideoWithId[];
  };

  const carta = new Carta({
    sanitizer: DOMPurify.sanitize,
  });
  
  function serializeComment(
    comment: VideoComment | SerializedVideoComment
  ): SerializedVideoComment {
    return {
      ...comment,
      createdAt: serializeDate(comment.createdAt),
      updatedAt: serializeDate(comment.updatedAt),
    };
  }

  function serializeDate(date: Timestamp | string | Date): string {
    if (date instanceof Timestamp) {
      return date.toDate().toISOString();
    } else if (date instanceof Date) {
      return date.toISOString();
    } else if (typeof date === "string") {
      // Check if it's already an ISO string
      return isNaN(Date.parse(date)) ? date : new Date(date).toISOString();
    } else {
      console.error("Unexpected date format:", date);
      return new Date().toISOString(); // Fallback to current date
    }
  }

  $: serializedComments = data.comments.map(serializeComment);

  $: ({ video, previousVideoId, nextVideoId, allVideos } = data);
  $: value = video?.description ?? "";

  async function navigateToVideo(videoId: string | null) {
    if (videoId) {
      await goto(`${base}/program/${videoId}`);
      await invalidate(`/program/${videoId}`);
    }
  }
</script>

{#key $page.url.pathname}
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

    <div class="mt-4">
      <VideoPlayer
        videoUrl={video.url}
        thumbnail={video.thumbnail}
        title={video.title}
      />

      <div class="flex justify-between mt-4">
        <button
          on:click={() => navigateToVideo(previousVideoId)}
          class="btn btn-primary {!previousVideoId ? 'btn-disabled' : ''}"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
          {$t("previousChapter")}
        </button>
        <button
          on:click={() => navigateToVideo(nextVideoId)}
          class="btn btn-primary {!nextVideoId ? 'btn-disabled' : ''}"
        >
          {$t("nextChapter")}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="mt-4 text-2xl">
      <h2 class="font-semibold mb-2">{$t("description")}</h2>
      <Markdown {carta} {value} />
    </div>
    <Comments data={{ comments: serializedComments, videoId: data.videoId }} />
  {/if}
{/key}
