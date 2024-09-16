<!-- VideoPlayer.svelte -->
<script lang="ts">
  import { onMount } from "svelte";

  export let videoUrl: string;
  export let thumbnail;
  export let title;
  // let player;

  onMount(() => {
    const script = document.createElement("script");
    script.src = "https://player.vimeo.com/api/player.js";
    script.async = true;
    document.body.appendChild(script);

    // script.onload = () => {
    //   player = new Vimeo.Player(document.querySelector('iframe'));
    // };

    return () => {
      document.body.removeChild(script);
    };
  });
</script>

<div class="relative w-full pt-[56.25%] rounded-xl overflow-hidden">
  <iframe
    src={videoUrl}
    class="absolute top-0 left-0 w-full h-full rounded-lg"
    frameborder="0"
    allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
    {title}
  ></iframe>
</div>
