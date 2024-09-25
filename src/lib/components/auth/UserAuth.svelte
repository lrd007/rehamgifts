<!-- UserAuth.svelte -->
<script lang="ts">
  import { base } from "$app/paths";
  import { page } from "$app/stores";
  import { signOut } from "firebase/auth";
  import { invalidateAll } from "$app/navigation";
  import { goto } from "$app/navigation";
  import { t } from "$lib/stores/language";
  import { userData } from "$lib/stores/user";
  import { auth } from "$lib/client/firebase";
  import { setIsRegistering, user } from "$lib/stores/auth";

  $: userName = $userData?.name.toUpperCase();

  async function handleLogout() {
    try {
      await fetch("/api/signin", { method: "DELETE" });
      await signOut(auth);
      await invalidateAll();
      goto(`${base}/`);
    } catch (error) {
      console.error($t("errorSigningOut"), error);
    }
  }

  function handleLogin() {
    setIsRegistering(false);
    goto(`${base}/#login`);
  }
  // $: console.log($user);
</script>

{#if $user}
  <div class="dropdown dropdown-end">
    <div
      tabindex="0"
      role="button"
      class="btn flex bg-rgHighlight sm:hover:bg-rgHighlightHover rounded-full border-none md:min-w-48"
    >
      <span class="md:inline hidden min-w-[100px] text-white">
        {#if userName}
          {userName}
        {:else}
          <div class="skeleton h-1 w-28"></div>
        {/if}
      </span>
      <div tabindex="0" role="button" class=" ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </div>
    </div>
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <ul
      tabindex="0"
      class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
    >
      <li class="lg:hidden">
        <a href="{base}/program">{$t("programs")}</a>
      </li>
      <li class="lg:hidden">
        <a href="{base}/about">{$t("about")}</a>
      </li>
      <li class="lg:hidden">
        <a href="{base}/contact">{$t("contact")}</a>
      </li>
      <li class="">
        <a href="{base}/profile">{$t("profile")}</a>
      </li>
      <li class="">
        <button on:click={handleLogout}>{$t("logout")}</button>
      </li>
    </ul>
  </div>
{:else}
  <button
    on:click={handleLogin}
    class="text-white sm:min-w-44 btn m-1 flex-none bg-rgHighlight sm:hover:bg-rgHighlightHover rounded-3xl border-none"
  >
    {$t("login")}
  </button>
{/if}
