<script lang="ts">
  import {
    createComment,
    deleteComment,
    getCommentsByVideoId,
    updateComment,
  } from "$lib/commentsFirbase";
  import { onMount } from "svelte";
  import type { VideoComment } from "./constants";
  import { userData, user } from "$lib/firebase";

  export let videoId: number;

  $: userFullName = $userData?.fullName ?? "";
  $: userId = $user?.uid.toString() ?? "";

  let comments: VideoComment[] = [];
  let newCommentContent = "";

  onMount(async () => {
    try {
      comments = await getCommentsByVideoId(videoId);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      // Handle error (e.g., show error message to user)
    }
  });

  async function addComment() {
    if (!newCommentContent.trim()) return;

    try {
      const newComment = await createComment(
        userId,
        userFullName,
        newCommentContent,
        videoId
      );
      comments = [newComment, ...comments]; // Add new comment to the beginning of the list
      newCommentContent = ""; // Clear the input
    } catch (error) {
      console.error("Failed to add comment:", error);
      // Handle error (e.g., show error message to user)
    }
  }

  async function editComment(commentId: string, newContent: string) {
    try {
      await updateComment(commentId, newContent);
      comments = comments.map((c) =>
        c.id === commentId
          ? { ...c, content: newContent, updatedAt: new Date() }
          : c
      );
    } catch (error) {
      console.error("Failed to update comment:", error);
      // Handle error (e.g., show error message to user)
    }
  }

  async function removeComment(commentId: string | undefined) {
    try {
      if (commentId === undefined) throw new Error("undefined comment id");
      await deleteComment(commentId);
      comments = comments.filter((c) => c.id !== commentId);
    } catch (error) {
      console.error("Failed to delete comment:", error);
      // Handle error (e.g., show error message to user)
    }
  }
</script>

<main>
  <h2>Comments</h2>

  <div class="comments-container">
    <div class="comments-scroll">
      <ul>
        {#each comments as comment (comment.id)}
          <li>
            <div class="comment-content">
              <p class="comment-text">{comment.content}</p>
              <div class="comment-meta">
                <span class="user-name">By {comment.userName}</span>
                <span class="comment-date"
                  >{new Date(comment.createdAt).toLocaleString()}</span
                >
              </div>
            </div>
            {#if comment.userId == $user?.uid}
              <div class="comment-actions">
                <button on:click={() => removeComment(comment.id)}
                  >Delete</button
                >
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  </div>

  <!-- New Comment Form -->
  <form on:submit|preventDefault={addComment}>
    <textarea bind:value={newCommentContent} placeholder="Write a comment..."
    ></textarea>
    <button type="submit">Post Comment</button>
  </form>
</main>

<style>
  main {
    max-width: 600px;
    margin: 0 auto;
    padding: 15px;
    font-family: Arial, sans-serif;
    font-size: 14px;
  }

  h2 {
    font-size: 20px;
    margin-bottom: 15px;
    color: #ffffff;
  }

  .comments-container {
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    margin-bottom: 20px;
    height: 400px; /* Fixed height for the container */
  }

  .comments-scroll {
    height: 100%;
    overflow-y: auto; /* Enable vertical scrolling */
    padding: 10px;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li {
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    padding: 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .comment-content {
    flex-grow: 1;
  }

  .comment-actions {
    margin-left: 10px;
  }

  .comment-text {
    font-size: 14px;
    line-height: 1.3;
    margin: 0 0 5px 0;
  }

  .comment-meta {
    align-items: center;
    font-size: 12px;
    color: #666;
  }

  .user-name {
    font-weight: bold;
  }

  .comment-date {
    color: #888;
  }

  button {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 3px 8px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #c0392b;
  }

  form {
    margin-top: 20px;
  }

  textarea {
    width: 100%;
    height: 80px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    resize: vertical;
  }

  form button {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
    margin-top: 8px;
    transition: background-color 0.3s ease;
  }

  form button:hover {
    background-color: #2980b9;
  }
</style>
