<!-- src/lib/components/admin/VideoManagement.svelte -->
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { createVideo, updateVideo, deleteVideo } from "$lib/videoFirebase";
  import type { Video, VideoWithId } from "$lib/types";
  import VideoForm from "./VideoForm.svelte";
  import { RefreshCw } from "lucide-svelte";

  export let videosData: VideoWithId[];

  let showAddForm = false;
  let editingVideo: VideoWithId | null = null;
  let loading = false;

  const dispatch = createEventDispatcher();

  async function handleAddVideo(event: CustomEvent<Video>) {
    try {
      loading = true;
      await createVideo(event.detail);
      dispatch("videoChange");
      showAddForm = false;
    } catch (error) {
      console.error("Error adding video:", error);
      alert("Failed to add video. Please try again.");
    } finally {
      loading = false;
    }
  }

  async function handleUpdateVideo(event: CustomEvent<Video>) {
    if (editingVideo) {
      try {
        loading = true;
        await updateVideo(editingVideo.id, event.detail);
        dispatch("videoChange");
        editingVideo = null;
      } catch (error) {
        console.error("Error updating video:", error);
        alert("Failed to update video. Please try again.");
      } finally {
        loading = false;
      }
    }
  }

  async function handleDeleteVideo(id: string) {
    if (confirm("Are you sure you want to delete this video?")) {
      try {
        loading = true;
        await deleteVideo(id);
        dispatch("videoChange");
      } catch (error) {
        console.error("Error deleting video:", error);
        alert("Failed to delete video. Please try again.");
      } finally {
        loading = false;
      }
    }
  }

  function refreshVideos() {
    dispatch("videoChange");
  }
</script>

<div>
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-2xl font-bold">Video Management</h2>
    <button class="btn btn-primary" on:click={refreshVideos} disabled={loading}>
      <RefreshCw size={20} class={loading ? "animate-spin" : ""} />
      Refresh Videos
    </button>
  </div>

  <button
    class="btn btn-primary mb-4"
    on:click={() => (showAddForm = !showAddForm)}
  >
    {showAddForm ? "Cancel" : "Add New Video"}
  </button>

  {#if showAddForm}
    <VideoForm on:submit={handleAddVideo} />
  {/if}

  {#if loading}
    <div class="flex justify-center items-center h-32">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="table w-full">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Video URL</th>
            <th>Thumbnail URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each videosData as video (video.id)}
            <tr>
              <td>{video.title}</td>
              <td>{video.description}</td>
              <td>
                <a href={video.url} target="_blank" class="link link-primary"
                  >{video.url}</a
                >
              </td>
              <td>
                <a
                  href={video.thumbnail}
                  target="_blank"
                  class="link link-secondary">{video.thumbnail}</a
                >
              </td>
              <td>
                {#if editingVideo?.id === video.id}
                  <VideoForm
                    video={editingVideo}
                    on:submit={handleUpdateVideo}
                    on:cancel={() => (editingVideo = null)}
                  />
                {:else}
                  <button
                    class="btn btn-sm btn-info mr-2"
                    on:click={() => (editingVideo = { ...video })}>Edit</button
                  >
                  <button
                    class="btn btn-sm btn-error"
                    on:click={() => handleDeleteVideo(video.id)}>Delete</button
                  >
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
