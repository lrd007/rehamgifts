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
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease,
      background-color 0.3s ease;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    overflow: hidden;
    aspect-ratio: 16 / 9; /* Maintains a 16:9 aspect ratio */
  }

  .video-container:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    background-color: rgba(0, 0, 0, 0.1);
  }

  .video-player {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: filter 0.3s ease;
  }

  .video-container:hover .video-player {
    filter: brightness(1.1);
  }

  .overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    opacity: 1;
    transition: opacity 0.3s ease;
  }

  .video-container:hover .overlay {
    opacity: 0.8;
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
    opacity: 0;
    transform: translateY(100%);
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
  }

  .video-container:hover .custom-controls {
    opacity: 1;
    transform: translateY(0);
  }

  .progress-bar {
    flex-grow: 1;
    height: 5px;
    background-color: rgba(255, 255, 255, 0.3);
    margin: 0 10px;
    cursor: pointer;
    border-radius: 2.5px;
    overflow: hidden;
  }

  .progress {
    height: 100%;
    background-color: #ff0000;
    transition: width 0.1s linear;
  }

  button,
  input[type="range"] {
    margin: 0 5px;
    opacity: 0.7;
    transition: opacity 0.3s ease;
  }

  button:hover,
  input[type="range"]:hover {
    opacity: 1;
  }

  button {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
  }

  input[type="range"] {
    -webkit-appearance: none;
    width: 100px;
    background: transparent;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #ff0000;
    cursor: pointer;
    margin-top: -6px;
  }

  input[type="range"]::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }

  :global(.video-container:fullscreen) {
    max-width: none;
    width: 100%;
  }

  :global(.video-container:fullscreen .video-player) {
    height: 100%;
  }
</style>
