<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";

  export let videoUrl: string;
  export let title: string;

  const dispatch = createEventDispatcher<{
    videoEnded: void;
  }>();

  let iframe: HTMLIFrameElement;

  $: embedUrl = getEmbedUrl(videoUrl);

  function getEmbedUrl(url: string): string {
    const videoId = url.split("/").pop();
    return `https://odysee.com/$/embed/${videoId}`;
  }

  onMount(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://odysee.com") return;

      try {
        const data = JSON.parse(event.data);
        if (data.event === "ended") {
          dispatch("videoEnded");
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  });
</script>

<div class="relative w-full pt-[56.25%] rounded-xl overflow-hidden">
  <iframe
    bind:this={iframe}
    src={embedUrl}
    class="absolute top-0 left-0 w-full h-full rounded-lg"
    frameborder="0"
    allow="autoplay; fullscreen"
    allowfullscreen
    {title}
  ></iframe>
</div>
