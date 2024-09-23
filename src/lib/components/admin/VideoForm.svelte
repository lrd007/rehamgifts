<!-- VideoForm.svelte -->
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Video, VideoWithId } from "$lib/types";

  export let video: Video | VideoWithId = {
    title: "",
    description: "",
    url: "",
    thumbnail: "",
    active: false,
    order: 0,
  };

  const dispatch = createEventDispatcher();

  function handleSubmit() {
    dispatch("submit", video);
  }

  function handleCancel() {
    dispatch("cancel");
  }

  $: isEditing = "id" in video;
</script>

<div class="card bg-base-200 shadow-xl mb-4">
  <div class="card-body">
    <h2 class="card-title">{isEditing ? "Edit Video" : "Add New Video"}</h2>
    <form on:submit|preventDefault={handleSubmit} class="space-y-4">
      <input
        class="input input-bordered w-full"
        bind:value={video.title}
        placeholder="Title"
        required
      />
      <input
        class="input input-bordered w-full"
        bind:value={video.description}
        placeholder="Description"
        required
      />
      <input
        class="input input-bordered w-full"
        type="url"
        bind:value={video.url}
        placeholder="Video URL"
        required
      />
      <input
        class="input input-bordered w-full"
        type="url"
        bind:value={video.thumbnail}
        placeholder="Thumbnail URL"
        required
      />
      <div class="flex items-center space-x-2">
        <input
          type="number"
          class="input input-bordered w-24"
          bind:value={video.order}
          placeholder="Order"
          min="0"
          required
        />
        <label class="cursor-pointer label">
          <span class="label-text mr-2">Active</span>
          <input
            type="checkbox"
            class="toggle toggle-primary"
            bind:checked={video.active}
          />
        </label>
      </div>
      <div class="flex justify-end space-x-2">
        <button type="submit" class="btn btn-primary">
          {isEditing ? "Update" : "Add"} Video
        </button>
        {#if isEditing}
          <button type="button" class="btn btn-ghost" on:click={handleCancel}>
            Cancel
          </button>
        {/if}
      </div>
    </form>
  </div>
</div>
