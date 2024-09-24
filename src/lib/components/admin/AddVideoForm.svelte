<!-- AddVideoForm.svelte -->
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { createVideo } from "$lib/videoFirebase";
  import type { Video } from "$lib/types";
  import { Plus, X } from "lucide-svelte";
  import MarkdownIt from "markdown-it";

  const md = new MarkdownIt();

  let loading = false;
  let newVideo: Video = {
    title: "",
    description: "",
    url: "",
    thumbnail: "",
    active: false,
    order: 0,
  };

  const dispatch = createEventDispatcher();

  async function handleAddVideo() {
    try {
      loading = true;
      await createVideo(newVideo);
      dispatch("videoAdded");
      resetForm();
    } catch (error) {
      console.error("Error adding video:", error);
      alert("Failed to add video. Please try again.");
    } finally {
      loading = false;
    }
  }

  function resetForm() {
    newVideo = {
      title: "",
      description: "",
      url: "",
      thumbnail: "",
      active: false,
      order: 0,
    };
  }

  function cancel() {
    dispatch("cancel");
  }

  function renderMarkdown(text: string) {
    return md.render(text);
  }
</script>

<div class="flex flex-col space-y-2">
  <input
    type="text"
    class="input input-bordered w-full"
    placeholder="Title"
    bind:value={newVideo.title}
  />
  <textarea
    class="textarea textarea-bordered w-full"
    placeholder="Description (Markdown supported)"
    bind:value={newVideo.description}
    rows="4"
  />
  <div class="preview">
    <h3 class="text-sm font-semibold">Preview:</h3>
    {@html renderMarkdown(newVideo.description)}
  </div>
  <input
    type="url"
    class="input input-bordered w-full"
    placeholder="Video URL"
    bind:value={newVideo.url}
  />
  <input
    type="url"
    class="input input-bordered w-full"
    placeholder="Thumbnail URL"
    bind:value={newVideo.thumbnail}
  />
  <input
    type="number"
    class="input input-bordered w-full"
    placeholder="Order"
    bind:value={newVideo.order}
  />
  <label class="cursor-pointer label">
    <span>Active</span>
    <input
      type="checkbox"
      bind:checked={newVideo.active}
      class="toggle toggle-primary"
    />
  </label>
  <div class="flex space-x-2">
    <button
      class="btn btn-sm btn-success"
      on:click={handleAddVideo}
      disabled={loading}
    >
      <Plus size={16} />
      Add
    </button>
    <button class="btn btn-sm btn-ghost" on:click={cancel} disabled={loading}>
      <X size={16} />
      Cancel
    </button>
  </div>
</div>
