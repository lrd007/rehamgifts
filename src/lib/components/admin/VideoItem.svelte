<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { updateVideo, deleteVideo } from "$lib/videoFirebase";
  import type { VideoWithId } from "$lib/types";
  import { Carta, MarkdownEditor, Markdown } from "carta-md";
  import "carta-md/default.css";
  import DOMPurify from "isomorphic-dompurify";

  const carta = new Carta({
    sanitizer: DOMPurify.sanitize,
  });

  export let video: VideoWithId;

  let editingId: string | null = null;
  let loading = false;

  const dispatch = createEventDispatcher();

  function startEditing() {
    editingId = video.id;
  }

  async function handleUpdate() {
    try {
      loading = true;
      await updateVideo(video.id, video);
      console.log("Video updated:", video);
      dispatch("videoUpdated", video);
      editingId = null;
    } catch (error) {
      console.error("Error updating video:", error);
      alert("Failed to update video. Please try again.");
    } finally {
      loading = false;
    }
  }

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this video?")) {
      try {
        loading = true;
        await deleteVideo(video.id);
        dispatch("videoDeleted", video.id);
      } catch (error) {
        console.error("Error deleting video:", error);
        alert("Failed to delete video. Please try again.");
      } finally {
        loading = false;
      }
    }
  }

  async function toggleVideoActive() {
    video.active = !video.active;
    await handleUpdate();
  }
</script>

<tr>
  <td>
    {#if editingId === video.id}
      <input
        type="text"
        class="input input-bordered w-full"
        bind:value={video.title}
      />
    {:else}
      {video.title || ""}
    {/if}
  </td>
  <td>
    {#if editingId === video.id}
      <MarkdownEditor {carta} bind:value={video.description} />
    {:else}
      <div class="prose max-w-none">
        <Markdown {carta} bind:value={video.description} />
      </div>
    {/if}
  </td>
  <td>
    {#if editingId === video.id}
      <input
        type="url"
        class="input input-bordered w-full"
        bind:value={video.url}
      />
    {:else}
      {video.url || ""}
    {/if}
  </td>
  <td>
    {#if editingId === video.id}
      <input
        type="url"
        class="input input-bordered w-full"
        bind:value={video.thumbnail}
      />
    {:else}
      {video.thumbnail || ""}
    {/if}
  </td>
  <td>
    {#if editingId === video.id}
      <input
        type="number"
        class="input input-bordered w-full"
        bind:value={video.order}
      />
    {:else}
      {video.order || 0}
    {/if}
  </td>
  <td>
    <label class="cursor-pointer label">
      <input
        type="checkbox"
        bind:checked={video.active}
        on:change={toggleVideoActive}
        class="toggle toggle-primary"
        disabled={loading}
      />
    </label>
  </td>
  <td>
    {#if editingId === video.id}
      <button
        class="btn btn-sm btn-success mr-2"
        on:click={handleUpdate}
        disabled={loading}
      >
        Save
      </button>
      <button
        class="btn btn-sm btn-ghost"
        on:click={() => (editingId = null)}
        disabled={loading}
      >
        Cancel
      </button>
    {:else}
      <button
        class="btn btn-sm btn-info mr-2"
        on:click={startEditing}
        disabled={loading}
      >
        Edit
      </button>
      <button
        class="btn btn-sm btn-error"
        on:click={handleDelete}
        disabled={loading}
      >
        Delete
      </button>
    {/if}
  </td>
</tr>
