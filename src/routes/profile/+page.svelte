<!-- /profile/+page.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { updatePassword } from "firebase/auth";
  import { doc, updateDoc } from "firebase/firestore";
  import { fade } from "svelte/transition";
  import { ErrorMessage, PasswordChange, VideoProgress } from "$lib/components";
  import { db } from "$lib/client/firebase";
  import { user } from "$lib/stores/auth";
  import { userData } from "$lib/stores/user";
  import type { VideoWithId } from "$lib/types";

  let loading = true;
  let error: string | null = null;
  let passwordChangeComponent: PasswordChange;
  let videos: VideoWithId[] = [];

  $: if ($user === null && !loading) {
    error = "Please log in to view your profile.";
  }

  onMount(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating network delay
      const response = await fetch("/api/videos");
      if (!response.ok) {
        throw new Error("Failed to fetch videos");
      }
      videos = await response.json();
      loading = false;
    } catch (err) {
      console.error("Error loading user data:", err);
      error = "Failed to load user data. Please try again later.";
      loading = false;
    }
  });

  async function handlePasswordChange(
    event: CustomEvent<{ newPassword: string }>
  ) {
    if (!$user) return;

    try {
      await updatePassword($user, event.detail.newPassword);
      passwordChangeComponent.handlePasswordChangeResult({
        success: true,
        message: "Password updated successfully",
      });
    } catch (err) {
      console.error("Error updating password:", err);
      passwordChangeComponent.handlePasswordChangeResult({
        success: false,
        message: "Failed to update password. Please try again.",
      });
    }
  }

  async function handleVideoToggle(
    event: CustomEvent<{ videoId: string; isWatched: boolean }>
  ) {
    if (!$user || !$userData) return;

    const { videoId, isWatched } = event.detail;
    const updatedWatchedVideos = isWatched
      ? [...$userData.watchedVideos, videoId]
      : $userData.watchedVideos.filter((id) => id !== videoId);

    try {
      await updateDoc(doc(db, "users", $user.uid), {
        watchedVideos: updatedWatchedVideos,
      });
      // The userData store will be automatically updated by the onSnapshot listener in firebase.ts
    } catch (err) {
      console.error("Error updating watched videos:", err);
      error = "Failed to update video progress. Please try again.";
    }
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-6 text-center">User Profile</h1>

  {#if loading}
    <div class="flex justify-center items-center h-64">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:else if error}
    <ErrorMessage {error} />
  {:else if $user && $userData}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="card bg-base-100 shadow-xl" transition:fade>
        <div class="card-body">
          <h2 class="card-title">Personal Information</h2>
          <p><strong>Email:</strong> {$user.email}</p>
          <p><strong>Name:</strong> {$userData.fullName}</p>
          <p><strong>Phone:</strong> {$userData.phoneNumber}</p>
        </div>
      </div>

      <PasswordChange
        bind:this={passwordChangeComponent}
        on:changePassword={handlePasswordChange}
      />
    </div>

    <div class="mt-6">
      <VideoProgress
        {videos}
        watchedVideos={$userData.watchedVideos}
        on:toggleVideo={handleVideoToggle}
      />
    </div>
  {/if}
</div>
