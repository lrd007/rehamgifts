<script lang="ts">
  import { onMount } from "svelte";
  import { fade, slide } from "svelte/transition";
  import { userData } from "$lib/stores/user";
  import { t } from "$lib/stores/language";
  import {
    createComment,
    getCommentsByVideoId,
    deleteComment,
  } from "$lib/services/comments";
  import type { VideoComment, SerializedVideoComment } from "$lib/types";
  import { page } from "$app/stores";
  import { Timestamp } from "firebase/firestore";
  import { invalidate } from "$app/navigation";

  export let data: { comments: SerializedVideoComment[]; videoId: string };

  let comments = data.comments;
  let videoId = data.videoId;
  $: totalComments = comments.length;
  let newCommentContent = "";
  let isLoading = false;
  let isSubmitting = false;
  let error = "";

  $: if ($page.params.videoId !== videoId) {
    videoId = $page.params.videoId;
    loadComments();
  }

  function formatDate(date: string | Timestamp): string {
    if (typeof date === "string") {
      return new Date(date).toLocaleString();
    } else {
      return date.toDate().toLocaleString();
    }
  }

  function serializeComment(comment: VideoComment): SerializedVideoComment {
    return {
      ...comment,
      createdAt: comment.createdAt.toDate().toISOString(),
      updatedAt: comment.updatedAt.toDate().toISOString(),
    };
  }

  async function loadComments() {
    isLoading = true;
    error = "";
    try {
      const result = await getCommentsByVideoId(videoId);
      comments = result.comments.map(serializeComment);
      await invalidate(`/program/${videoId}`);
    } catch (e) {
      error = $t("fetchCommentsError");
    } finally {
      isLoading = false;
    }
  }

  async function handleSubmit() {
    if (!$userData || !newCommentContent.trim()) return;

    isSubmitting = true;
    error = "";
    try {
      await createComment(
        videoId,
        $userData.id,
        $userData.name,
        newCommentContent.trim()
      );
      newCommentContent = "";
      await loadComments();
    } catch (e) {
      error = $t("postCommentError");
    } finally {
      isSubmitting = false;
    }
  }

  async function handleDelete(commentId: string) {
    if (!confirm($t("confirmDeleteComment"))) return;

    error = "";
    try {
      await deleteComment(videoId, commentId);
      await loadComments();
    } catch (e) {
      error = $t("deleteCommentError");
    }
  }

  onMount(() => {
    if (comments.length === 0) {
      loadComments();
    }
  });
</script>

<section class="max-w-2xl mx-auto p-4">
  <h2 class="text-2xl font-bold mb-4 text-primary">
    {$t("comments")} ({totalComments})
  </h2>

  {#if $userData}
    <form on:submit|preventDefault={handleSubmit} class="mb-6">
      <div class="relative">
        <textarea
          bind:value={newCommentContent}
          placeholder={$t("writeAComment")}
          required
          class="textarea textarea-bordered w-full pr-24 resize-none"
          rows="3"
        />
        <button
          type="submit"
          class="btn btn-primary absolute bottom-2 right-2"
          disabled={!newCommentContent.trim() || isSubmitting}
        >
          {#if isSubmitting}
            <span class="loading loading-spinner loading-sm"></span>
          {:else}
            {$t("post")}
          {/if}
        </button>
      </div>
    </form>
  {:else}
    <p class="text-center text-gray-500 mb-6">
      {$t("signInToComment")}
    </p>
  {/if}

  {#if error}
    <div class="alert alert-error mb-4" transition:fade>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        /></svg
      >
      <span>{error}</span>
    </div>
  {/if}

  {#if isLoading}
    <div class="flex justify-center items-center py-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:else if comments.length === 0}
    <p class="text-center text-gray-500 py-8">
      {$t("noComments")}
    </p>
  {:else}
    <ul class="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      {#each comments as comment (comment.id)}
        <li class="card bg-base-200 shadow-xl" transition:slide|local>
          <div class="card-body py-4 px-5">
            <p class="mb-2 text-gray-500">{comment.content}</p>
            <div class="flex justify-between items-center text-sm">
              <div>
                <span class="font-semibold">{comment.userName}</span>
                <span class="mx-1">•</span>
                <span>{formatDate(comment.createdAt)}</span>
              </div>
              {#if $userData && comment.userId === $userData.id}
                <button
                  on:click={() => handleDelete(comment.id)}
                  class="btn btn-ghost btn-xs text-error"
                >
                  {$t("delete")}
                </button>
              {/if}
            </div>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>
