<!-- /+page.svelte -->
<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation";
  import type { PageData } from "./$types";
  import { t } from "$lib/stores/language";
  import freeProgram from "$lib/assets/reham-assets/branding/free_program.jpeg";
  import { Pattern } from "$lib/components";
  import { user } from "$lib/stores/auth";
  import { base } from "$app/paths";
  import Auth from "$lib/components/auth/Auth.svelte";
  import VideoGrid from "$lib/components/layout/VideoGrid.svelte";

  export let data: PageData;

  let isLoading = false;
  let error = "";
  // $: console.log($user);
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
  function handleLoginSuccess() {
    return handleAuthAction(async () => {
      await goto("/program");
    });
  }
</script>

<div class="flex justify-center mb-20">
  <a href="/program" class="inline-block">
    <img
      class="w-auto md:max-h-[75vh] lg:max-h-[85vh]"
      src={freeProgram}
      alt="Free Program"
    />
  </a>
</div>
<div class="flex flex-col items-center justify-center mx-auto">
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
    <span class="my-10 loading loading-spinner loading-lg"></span>
  {:else if $user}
    <h1 class="text-3xl font-bold my-8">{$t("continueWatching")}</h1>
    <VideoGrid videos={data.videos} />
  {:else}
    <h1 class="text-3xl font-bold mt-8">
      {$t("registerForSecretsOfFemaleIntelligence")}
    </h1>
    <Auth
      countriesData={data.countriesData}
      on:loginSuccess={handleLoginSuccess}
      bind:isLoading
    />
  {/if}
</div>

<Pattern left right animate />
