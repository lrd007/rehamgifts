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

<div style="padding:56.25% 0 0 0;position:relative;">
  <iframe
    src={videoUrl}
    frameborder="0"
    allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
    style="position:absolute;top:0;left:0;width:100%;height:100%;"
    {title}
  ></iframe>
</div>
