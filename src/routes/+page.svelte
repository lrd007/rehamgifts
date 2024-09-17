<!-- /+page.svelte -->
<script lang="ts">
  import { signOut } from "firebase/auth";
  import { goto, invalidateAll } from "$app/navigation";
  import { t } from "$lib/stores/language";
  import { Pattern } from "$lib/components";
  import freeProgram from "$lib/assets/reham-assets/branding/free_program.jpeg";
  import CredentialsLogin from "$lib/components/auth/CredentialsLogin.svelte";
  import type { PageData } from "./$types";
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

<div class="flex justify-center">
  <a href="/watch" class="inline-block">
    <img
      class="w-auto md:max-h-[75vh] lg:max-h-[85vh]"
      src={freeProgram}
      alt="Free Program"
    />
  </a>
</div>
<CredentialsLogin
  countriesData={data.countriesData}
  on:loginSuccess={handleLoginSuccess}
  bind:isLoading
/>
<Pattern left right animate />
