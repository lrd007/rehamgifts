<script lang="ts">
  import { signOut } from "firebase/auth";
  import { goto, invalidateAll } from "$app/navigation";
  import type { PageData } from "./$types";
  import { t } from "$lib/stores/language";
  import CredentialsLogin from "$lib/components/auth/CredentialsLogin.svelte";
  import { user } from "$lib/stores/auth";
  import { auth } from "$lib/client/firebase";

  export let data: PageData;

  let isLoading = false;
  let error = "";

  async function handleAuthAction(action: () => Promise<void>) {
    try {
      error = "";
      await action();
      await invalidateAll();
    } catch (err) {
      console.error($t("authenticationError"), err);
      error = $t(isLoading ? "signOutError" : "loginError");
    } finally {
      isLoading = false;
    }
  }

  function signOutSSR() {
    isLoading = true;
    return handleAuthAction(async () => {
      const res = await fetch("/api/signin", { method: "DELETE" });
      if (!res.ok) throw new Error($t("serverSignOutError"));
      await signOut(auth);
    });
  }

  function handleLoginSuccess() {
    return handleAuthAction(async () => {
      await goto("/");
    });
  }
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-base-200">
  <h2 class="text-3xl font-bold mb-8">{$t("authentication")}</h2>

  {#if error}
    <div class="alert alert-error shadow-lg mb-4">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current flex-shrink-0 h-6 w-6"
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
    </div>
  {/if}

  {#if isLoading}
    <span class="loading loading-spinner loading-lg"></span>
  {:else if $user}
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body items-center text-center">
        <h2 class="card-title">
          {$t("Welcome")}, {$user.displayName || $user.email}
        </h2>
        <p class="text-success">{$t("loggedInMessage")}</p>
        <div>
          <button
            class="btn btn-warning m-2"
            on:click={signOutSSR}
            disabled={isLoading}
          >
            {$t("signOut")}
          </button>
          <button
            class="btn btn-warning m-2"
            on:click={() => goto("/")}
            disabled={isLoading}
          >
            {$t("back")}
          </button>
        </div>
      </div>
    </div>
  {:else}
    <CredentialsLogin
      countriesData={data.countriesData}
      on:loginSuccess={handleLoginSuccess}
      bind:isLoading
    />
  {/if}
</div>
