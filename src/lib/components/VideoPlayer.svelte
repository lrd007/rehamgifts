<script lang="ts">
  import { onMount } from "svelte";
  import { user } from "$lib/firebase";
  export let videoKey: string;
  export let dataVideoId: string;

  let videoElement: HTMLVideoElement;
  let videoContainer: HTMLDivElement;
  let status: string = "Click to load video";
  let isPlaying: boolean = false;
  let currentTime: number = 0;
  let duration: number = 0;
  let volume: number = 1;
  let isLoaded: boolean = false;
  let isFullScreen: boolean = false;

  function loadVideo(): void {
    if ($user && !isLoaded) {
      status = "Loading video...";
      videoElement.src = `/api/get-video-url/${videoKey}`;
      isLoaded = true;

      videoElement.addEventListener("loadedmetadata", () => {
        status = "";
        duration = videoElement.duration;
        togglePlay(); // Start playing once loaded
      });

      videoElement.addEventListener("error", () => {
        status = "Error loading video";
      });

      videoElement.addEventListener("timeupdate", () => {
        currentTime = videoElement.currentTime;
      });
    } else if ($user && isLoaded) {
      togglePlay();
    }
  }

  function togglePlay(): void {
    if ($user && isLoaded) {
      if (videoElement.paused) {
        videoElement.play();
        isPlaying = true;
      } else {
        videoElement.pause();
        isPlaying = false;
      }
    }
  }

  function seekTo(event: MouseEvent): void {
    if ($user && isLoaded) {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      const x = event.clientX - rect.left;
      const clickedValue = (x / rect.width) * duration;
      videoElement.currentTime = clickedValue;
    }
  }

  function formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  function updateVolume(): void {
    if ($user && isLoaded) {
      videoElement.volume = volume;
    }
  }

  function toggleFullScreen(): void {
    if (!document.fullscreenElement) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      }
      isFullScreen = true;
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      isFullScreen = false;
    }
  }

  onMount(() => {
    document.addEventListener("fullscreenchange", () => {
      isFullScreen = !!document.fullscreenElement;
    });
  });
</script>

<div class="video-container" bind:this={videoContainer}>
  <video bind:this={videoElement} on:click={loadVideo} class="video-player">
    Your browser does not support the video tag.
  </video>

  {#if !$user}
    <div class="overlay signin-overlay">
      <span>Sign in to watch</span>
    </div>
  {:else if !isLoaded}
    <div class="overlay load-overlay" on:click={loadVideo}>
      <span>{status}</span>
    </div>
  {:else if status}
    <div class="overlay">
      <p id="status">{status}</p>
    </div>
  {/if}

  {#if isLoaded}
    <div class="custom-controls">
      <button on:click={togglePlay}>
        {isPlaying ? "❚❚" : "▶"}
      </button>
      <div class="progress-bar" on:click={seekTo}>
        <div
          class="progress"
          style="width: {(currentTime / duration) * 100}%"
        ></div>
      </div>
      <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        bind:value={volume}
        on:input={updateVolume}
      />
      <button on:click={toggleFullScreen}>
        {isFullScreen ? "⤢" : "⤡"}
      </button>
    </div>
  {/if}
</div>

<style>
  .video-container {
    position: relative;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }

  .video-player {
    width: 100%;
    height: auto;
  }

  .overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
  }

  .signin-overlay {
    background-color: rgba(0, 0, 0, 0.7);
  }

  .load-overlay {
    background-color: rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }

  .custom-controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 10px;
    display: flex;
    align-items: center;
  }

  .progress-bar {
    flex-grow: 1;
    height: 5px;
    background-color: gray;
    margin: 0 10px;
    cursor: pointer;
  }

  .progress {
    height: 100%;
    background-color: red;
  }

  button,
  input[type="range"] {
    margin: 0 5px;
  }

  :global(.video-container:fullscreen) {
    max-width: none;
    width: 100%;
  }

  :global(.video-container:fullscreen .video-player) {
    height: 100%;
  }
</style>
