<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import PasswordInput from "./PasswordInput.svelte";

  const dispatch = createEventDispatcher<{
    changePassword: { newPassword: string };
  }>();

  let newPassword = "";
  let confirmNewPassword = "";
  let passwordError: string | null = null;
  let passwordSuccess: string | null = null;

  async function changePassword() {
    if (newPassword !== confirmNewPassword) {
      passwordError = "Passwords do not match";
      return;
    }

    if (newPassword.length < 8) {
      passwordError = "Password must be at least 8 characters long";
      return;
    }

    dispatch("changePassword", { newPassword });
  }

  export function handlePasswordChangeResult(result: {
    success: boolean;
    message: string;
  }) {
    if (result.success) {
      passwordSuccess = result.message;
      newPassword = "";
      confirmNewPassword = "";
      passwordError = null;
    } else {
      passwordError = result.message;
    }
  }
</script>

<div class="card bg-base-100 shadow-xl" transition:fade>
  <div class="card-body">
    <h2 class="card-title">Change Password</h2>
    <form on:submit|preventDefault={changePassword} class="space-y-4">
      <PasswordInput
        id="newPassword"
        bind:value={newPassword}
        placeholder="New Password"
        error={passwordError}
      >
        New Password
      </PasswordInput>

      <PasswordInput
        id="confirmNewPassword"
        bind:value={confirmNewPassword}
        placeholder="Confirm New Password"
      >
        Confirm New Password
      </PasswordInput>

      <div class="form-control mt-6">
        <button type="submit" class="btn btn-primary">Change Password</button>
      </div>
    </form>
    {#if passwordError}
      <div class="alert alert-error mt-4" transition:fade>
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
        <span>{passwordError}</span>
      </div>
    {/if}
    {#if passwordSuccess}
      <div class="alert alert-success mt-4" transition:fade>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          /></svg
        >
        <span>{passwordSuccess}</span>
      </div>
    {/if}
  </div>
</div>
