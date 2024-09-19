<!-- VideoManagement.svelte -->
<script lang="ts">
  import { createVideo, updateVideo, deleteVideo } from "$lib/videoFirebase";
  import type { Video, VideoWithId } from "$lib/types";
  import VideoForm from "./VideoForm.svelte";

  export let videos: VideoWithId[];
  export let onRefresh: () => Promise<void>;

  let showAddForm = false;
  let editingVideo: VideoWithId | null = null;

  async function handleAddVideo(event: CustomEvent<Video>) {
    try {
      const addedVideo = await createVideo(event.detail);
      videos = [addedVideo, ...videos];
      showAddForm = false;
    } catch (error) {
      console.error("Error adding video:", error);
      alert("Failed to add video. Please try again.");
    }
  }

  async function handleUpdateVideo(event: CustomEvent<Video>) {
    if (editingVideo) {
      try {
        await updateVideo(editingVideo.id, event.detail);
        const index = videos.findIndex((v) => v.id === editingVideo?.id);
        if (index !== -1) {
          videos[index] = { ...videos[index], ...event.detail };
          videos = [...videos]; // Trigger reactivity
        }
        editingVideo = null;
      } catch (error) {
        console.error("Error updating video:", error);
        alert("Failed to update video. Please try again.");
      }
    }
  }

  async function handleDeleteVideo(id: string) {
    if (confirm("Are you sure you want to delete this video?")) {
      try {
        await deleteVideo(id);
        videos = videos.filter((v) => v.id !== id);
      } catch (error) {
        console.error("Error deleting video:", error);
        alert("Failed to delete video. Please try again.");
      }
    }
  }
</script>

<h2 class="text-2xl font-bold mb-4">Video Management</h2>
<button
  class="btn btn-primary mb-4"
  on:click={() => (showAddForm = !showAddForm)}
>
  {showAddForm ? "Cancel" : "Add New Video"}
</button>

{#if showAddForm}
  <VideoForm on:submit={handleAddVideo} />
{/if}

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
      {#each videos as video (video.id)}
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
