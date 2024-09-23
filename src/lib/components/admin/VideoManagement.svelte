<!-- src/lib/components/admin/VideoManagement.svelte -->
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { createVideo, updateVideo, deleteVideo } from "$lib/videoFirebase";
  import type { Video, VideoWithId } from "$lib/types";
  import { RefreshCw, Plus, X } from "lucide-svelte";

  export let videosData: VideoWithId[];

  let editingId: string | null = null;
  let loading = false;
  let showAddForm = false;
  let newVideo: Video = {
    title: "",
    description: "",
    url: "",
    thumbnail: "",
    active: false,
    order: 0,
  };

  const dispatch = createEventDispatcher();

  function startEditing(video: VideoWithId) {
    editingId = video.id;
  }

  async function handleUpdate(video: VideoWithId) {
    try {
      loading = true;
      await updateVideo(video.id, video);
      dispatch("videoChange");
      editingId = null;
    } catch (error) {
      console.error("Error updating video:", error);
      alert("Failed to update video. Please try again.");
    } finally {
      loading = false;
    }
  }

  async function handleDelete(id: string) {
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

  async function toggleVideoActive(video: VideoWithId) {
    const updatedVideo = { ...video, active: !video.active };
    await handleUpdate(updatedVideo);
  }

  async function handleAddVideo() {
    try {
      loading = true;
      await createVideo(newVideo);
      dispatch("videoChange");
      showAddForm = false;
      newVideo = {
        title: "",
        description: "",
        url: "",
        thumbnail: "",
        active: false,
        order: 0,
      };
    } catch (error) {
      console.error("Error adding video:", error);
      alert("Failed to add video. Please try again.");
    } finally {
      loading = false;
    }
  }

  function refreshVideos() {
    dispatch("videoChange");
  }

  type EditableField = "title" | "description" | "url" | "thumbnail" | "order";
  const editableFields: EditableField[] = [
    "title",
    "description",
    "url",
    "thumbnail",
    "order",
  ];
</script>

<div>
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-2xl font-bold">Video Management</h2>
    <button class="btn btn-primary" on:click={refreshVideos} disabled={loading}>
      <RefreshCw size={20} class={loading ? "animate-spin" : ""} />
      Refresh Videos
    </button>
  </div>

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
            <th>Order</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <!-- Add New Video Row -->
          <tr>
            <td colspan="7">
              {#if showAddForm}
                <div class="flex items-center space-x-2">
                  {#each editableFields as field}
                    {#if field === "order"}
                      <input
                        type="number"
                        class="input input-bordered w-full"
                        placeholder="Order"
                        bind:value={newVideo.order}
                      />
                    {:else if field === "url" || field === "thumbnail"}
                      <input
                        type="url"
                        class="input input-bordered w-full"
                        placeholder={field.charAt(0).toUpperCase() +
                          field.slice(1)}
                        bind:value={newVideo[field]}
                      />
                    {:else}
                      <input
                        type="text"
                        class="input input-bordered w-full"
                        placeholder={field.charAt(0).toUpperCase() +
                          field.slice(1)}
                        bind:value={newVideo[field]}
                      />
                    {/if}
                  {/each}
                  <label class="cursor-pointer label">
                    <input
                      type="checkbox"
                      bind:checked={newVideo.active}
                      class="toggle toggle-primary"
                    />
                  </label>
                  <button
                    class="btn btn-sm btn-success"
                    on:click={handleAddVideo}
                  >
                    <Plus size={16} />
                    Add
                  </button>
                  <button
                    class="btn btn-sm btn-ghost"
                    on:click={() => (showAddForm = false)}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              {:else}
                <button
                  class="btn btn-primary"
                  on:click={() => (showAddForm = true)}
                >
                  <Plus size={20} />
                  Add New Video
                </button>
              {/if}
            </td>
          </tr>

          <!-- Existing Videos -->
          {#each videosData as video (video.id)}
            <tr>
              {#each editableFields as field}
                <td>
                  {#if editingId === video.id}
                    {#if field === "order"}
                      <input
                        type="number"
                        class="input input-bordered w-full"
                        bind:value={video.order}
                      />
                    {:else if field === "url" || field === "thumbnail"}
                      <input
                        type="url"
                        class="input input-bordered w-full"
                        bind:value={video[field]}
                      />
                    {:else}
                      <input
                        type="text"
                        class="input input-bordered w-full"
                        bind:value={video[field]}
                      />
                    {/if}
                  {:else}
                    {video[field]}
                  {/if}
                </td>
              {/each}
              <td>
                <label class="cursor-pointer label">
                  <input
                    type="checkbox"
                    bind:checked={video.active}
                    on:change={() => toggleVideoActive(video)}
                    class="toggle toggle-primary"
                    disabled={loading}
                  />
                </label>
              </td>
              <td>
                {#if editingId === video.id}
                  <button
                    class="btn btn-sm btn-success mr-2"
                    on:click={() => handleUpdate(video)}>Save</button
                  >
                  <button
                    class="btn btn-sm btn-ghost"
                    on:click={() => (editingId = null)}>Cancel</button
                  >
                {:else}
                  <button
                    class="btn btn-sm btn-info mr-2"
                    on:click={() => startEditing(video)}>Edit</button
                  >
                  <button
                    class="btn btn-sm btn-error"
                    on:click={() => handleDelete(video.id)}>Delete</button
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
