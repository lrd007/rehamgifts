<!-- VideoManagement.svelte -->
<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import type { VideoWithId } from "$lib/types";
  import { RefreshCw, Plus } from "lucide-svelte";
  import VideoList from "./VideoList.svelte";
  import AddVideoForm from "./AddVideoForm.svelte";

  let videosData: VideoWithId[] = [];
  let loading = false;
  let showAddForm = false;

  const dispatch = createEventDispatcher();

  async function loadVideos() {
    loading = true;
    try {
      const response = await fetch("/api/admin/videos");
      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }
      videosData = await response.json();
    } catch (error) {
      console.error("Error loading videos:", error);
      alert("Failed to load videos. Please try again.");
    } finally {
      loading = false;
    }
  }

  function handleVideoChange() {
    loadVideos();
    dispatch("videoChange");
  }

  // Initial load
  onMount(async () => {
    loadVideos();
  });
</script>

<div>
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-2xl font-bold">Video Management</h2>
    <button class="btn btn-primary" on:click={loadVideos} disabled={loading}>
      <RefreshCw size={20} class={loading ? "animate-spin" : ""} />
      Refresh Videos
    </button>
  </div>

  {#if loading}
    <div class="flex justify-center items-center h-32">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:else}
    <div class="mb-4">
      {#if showAddForm}
        <AddVideoForm
          on:videoAdded={handleVideoChange}
          on:cancel={() => (showAddForm = false)}
        />
      {:else}
        <button class="btn btn-primary" on:click={() => (showAddForm = true)}>
          <Plus size={20} />
          Add New Video
        </button>
      {/if}
    </div>

    <VideoList
      {videosData}
      on:videoUpdated={handleVideoChange}
      on:videoDeleted={handleVideoChange}
    />
  {/if}
</div>
