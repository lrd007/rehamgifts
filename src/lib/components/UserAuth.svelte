<script lang="ts">
  import { base } from "$app/paths";
  import { signOut } from "firebase/auth";
  import { auth } from "$lib/firebase";
  import { invalidateAll } from "$app/navigation";
  import { userData } from "$lib/firebase";
  import { goto } from "$app/navigation";
  import { t } from "$lib/language";

  $: userFullName = $userData?.fullName.toUpperCase();

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
    goto(`${base}/login`);
  }
</script>

{#if $userData}
  <div class="dropdown dropdown-end">
    <div
      tabindex="0"
      role="button"
      class="btn flex bg-rgHighlight sm:hover:bg-rgHighlightHover rounded-3xl border-none md:min-w-48"
    >
      <span class="md:inline hidden min-w-[100px] text-white">
        {#if userFullName}
          {userFullName}
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
    <ul
      tabindex="0"
      class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
    >
      <li class="lg:hidden hover:bg-pink-100 hover:text-pink-900">
        <a href="{base}/about">{$t("about")}</a>
      </li>
      <li class="lg:hidden hover:bg-pink-100 hover:text-pink-900">
        <a href="{base}/contact">{$t("contact")}</a>
      </li>
      <li class="hover:bg-pink-100 hover:text-pink-900">
        <a href="{base}/profile">{$t("profile")}</a>
      </li>
      <li class="hover:bg-pink-100 hover:text-pink-900">
        <a on:click={handleLogout} href="javascript:void(0);">{$t("logout")}</a>
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
