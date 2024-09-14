<!-- VideoPlayer.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    Minimize,
  } from "lucide-svelte";
  import { user } from "$lib/stores/auth";

  export let videoKey: string;
  export let thumbnail: string;

  let videoElement: HTMLVideoElement;
  let videoContainer: HTMLDivElement;
  let status: string = "";
  let isPlaying: boolean = false;
  let currentTime: number = 0;
  let duration: number = 0;
  let volume: number = 1;
  let isMuted: boolean = false;
  let isLoaded: boolean = false;
  let isFullScreen: boolean = false;
  let signedUrl: string = "";

  $: progress = (currentTime / duration) * 100 || 0;

  // Store all video players
  let allPlayers: HTMLVideoElement[] = [];

  onMount(() => {
    allPlayers = Array.from(document.querySelectorAll("video"));
    document.addEventListener("fullscreenchange", () => {
      isFullScreen = !!document.fullscreenElement;
    });
  });

  async function loadAndPlayVideo(): Promise<void> {
    if (!$user || isLoaded) return;

    // Pause all other videos before loading the new one
    pauseAllVideos();

    status = "Loading video...";
    try {
      const response = await fetch(`/api/get-video-url/${videoKey}`);
      if (!response.ok) throw new Error("Failed to fetch video URL");

      signedUrl = await response.text();
      videoElement.src = signedUrl;
      isLoaded = true;

      videoElement.addEventListener("loadedmetadata", () => {
        status = "";
        duration = videoElement.duration;
        playVideo();
      });

      videoElement.addEventListener("timeupdate", () => {
        currentTime = videoElement.currentTime;
      });

      videoElement.addEventListener("play", () => {
        isPlaying = true;
        pauseOtherVideos();
      });

      videoElement.addEventListener("pause", () => {
        isPlaying = false;
      });
    } catch (error) {
      console.error("Error fetching video URL:", error);
      status = "Error loading video";
    }
  }

  function playVideo(): void {
    if (!$user || !isLoaded) return;
    videoElement.play();
    isPlaying = true;
    pauseOtherVideos();
  }

  function pauseVideo(): void {
    if (!$user || !isLoaded) return;
    videoElement.pause();
    isPlaying = false;
  }

  function pauseAllVideos(): void {
    allPlayers.forEach((player) => {
      if (!player.paused) {
        player.pause();
      }
    });
  }

  function pauseOtherVideos(): void {
    allPlayers.forEach((player) => {
      if (player !== videoElement && !player.paused) {
        player.pause();
      }
    });
  }

  function togglePlay(): void {
    isPlaying ? pauseVideo() : playVideo();
  }

  function seekTo(event: MouseEvent): void {
    if (!$user || !isLoaded) return;
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    videoElement.currentTime = (x / rect.width) * duration;
  }

  function formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function toggleMute(): void {
    if (!$user || !isLoaded) return;
    videoElement.muted = !videoElement.muted;
    isMuted = videoElement.muted;
    volume = isMuted ? 0 : 1;
  }

  function updateVolume(): void {
    if (!$user || !isLoaded) return;
    videoElement.volume = volume;
    isMuted = volume === 0;
  }

  function toggleFullScreen(): void {
    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    isFullScreen = !isFullScreen;
  }
</script>

<div
  class="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden aspect-video bg-black shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
  bind:this={videoContainer}
>
  <video
    bind:this={videoElement}
    class="w-full h-full object-cover"
    poster={thumbnail}
    on:click={togglePlay}
  >
    Your browser does not support the video tag.
  </video>

  {#if !$user}
    <div
      class="absolute inset-0 flex items-center justify-center text-white font-bold bg-black bg-opacity-70"
    >
      <span>Sign in to watch</span>
    </div>
  {:else if !isLoaded}
    <div
      class="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50 cursor-pointer"
      on:click={loadAndPlayVideo}
    >
      <Play size={48} />
    </div>
  {:else if status}
    <div
      class="absolute inset-0 flex items-center justify-center text-white bg-black bg-opacity-50"
    >
      <p id="status">{status}</p>
    </div>
  {/if}

  {#if isLoaded}
    <div
      class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 flex items-center opacity-0 translate-y-full transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
    >
      <button
        class="text-white opacity-70 hover:opacity-100 transition-opacity duration-300"
        on:click={togglePlay}
      >
        {#if isPlaying}
          <Pause class="w-6 h-6" />
        {:else}
          <Play class="w-6 h-6" />
        {/if}
      </button>
      <div
        class="flex-grow mx-2 h-1 bg-white bg-opacity-30 rounded cursor-pointer"
        on:click={seekTo}
      >
        <div class="h-full bg-red-600 rounded" style="width: {progress}%"></div>
      </div>
      <span class="text-white text-sm mx-2"
        >{formatTime(currentTime)} / {formatTime(duration)}</span
      >
      <button
        class="text-white opacity-70 hover:opacity-100 transition-opacity duration-300"
        on:click={toggleMute}
      >
        {#if isMuted}
          <VolumeX class="w-6 h-6" />
        {:else}
          <Volume2 class="w-6 h-6" />
        {/if}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        bind:value={volume}
        on:input={updateVolume}
        class="w-24 mx-2"
      />
      <button
        class="text-white opacity-70 hover:opacity-100 transition-opacity duration-300"
        on:click={toggleFullScreen}
      >
        {#if isFullScreen}
          <Minimize class="w-6 h-6" />
        {:else}
          <Maximize class="w-6 h-6" />
        {/if}
      </button>
    </div>
  {/if}
</div>

<style>
  /* Custom styles for range input */
  input[type="range"] {
    -webkit-appearance: none;
    @apply bg-transparent;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    @apply h-4 w-4 rounded-full bg-red-600 cursor-pointer -mt-1.5;
  }

  input[type="range"]::-webkit-slider-runnable-track {
    @apply w-full h-1 bg-white bg-opacity-30 rounded;
  }

  /* Fullscreen styles */
  :global(.video-container:fullscreen) {
    @apply max-w-none w-full;
  }

  :global(.video-container:fullscreen .video-player) {
    @apply h-full;
  }
</style>
