<!-- Comments.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { fade, slide } from "svelte/transition";
  import { userData } from "$lib/stores/user";
  import {
    createComment,
    getCommentsByVideoId,
    deleteComment,
  } from "$lib/services/comments";
  import type { VideoComment } from "$lib/types";
  import { Timestamp } from "firebase/firestore";

  export let videoId: string;

  let comments: VideoComment[] = [];
  let newCommentContent = "";
  let isLoading = true;
  let isSubmitting = false;
  let error = "";

  function formatDate(timestamp: Timestamp): string {
    return timestamp.toDate().toLocaleString();
  }

  async function loadComments() {
    isLoading = true;
    error = "";
    try {
      comments = await getCommentsByVideoId(videoId);
    } catch (e) {
      error = "Failed to load comments. Please try again.";
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
        $userData.fullName,
        newCommentContent.trim()
      );
      newCommentContent = "";
      await loadComments();
    } catch (e) {
      error = "Failed to post comment. Please try again.";
    } finally {
      isSubmitting = false;
    }
  }

  async function handleDelete(commentId: string) {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    error = "";
    try {
      await deleteComment(videoId, commentId);
      await loadComments();
    } catch (e) {
      error = "Failed to delete comment. Please try again.";
    }
  }

  onMount(loadComments);
</script>

<section class="max-w-2xl mx-auto p-4">
  <h2 class="text-2xl font-bold mb-4 text-primary">Comments</h2>

  {#if $userData}
    <form on:submit|preventDefault={handleSubmit} class="mb-6">
      <div class="relative">
        <textarea
          bind:value={newCommentContent}
          placeholder="Write a comment..."
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
            Post
          {/if}
        </button>
      </div>
    </form>
  {:else}
    <p class="text-center text-gray-500 mb-6">
      Please sign in to post a comment.
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
      No comments yet. Be the first to comment!
    </p>
  {:else}
    <ul class="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      {#each comments as comment (comment.id)}
        <li class="card bg-base-200 shadow-xl" transition:slide|local>
          <div class="card-body py-4 px-5">
            <p class="mb-2">{comment.content}</p>
            <div
              class="flex justify-between items-center text-sm text-gray-500"
            >
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
                  Delete
                </button>
              {/if}
            </div>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>
