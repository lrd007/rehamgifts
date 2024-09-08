<script lang="ts">
  import { base } from "$app/paths";
  import logo from "$lib/assets/rehamdiva-logo.png";
  import { user, userData, type UserData } from "$lib/firebase";
  import avatar from "$lib/assets/avatar.png";
  import { signOut } from "firebase/auth";
  import { auth } from "$lib/firebase";
  import LanguageToggle from "./LanguageToggle.svelte";

  async function handleLogout() {
    try {
      await signOut(auth);
      // Optionally, you can redirect the user or update the UI here
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  let dropdownOpen = false;

  function toggleDropdown() {
    dropdownOpen = !dropdownOpen;
  }

  function handleKeyDown(event: { key: string }) {
    if (event.key === "Enter" || event.key === " ") {
      toggleDropdown();
    }
  }

  $: userFullName = $userData?.fullName.toUpperCase() || "";
</script>

<header
  class="bg-rgPrimary text-white font-bold shadow-lg relative overflow-hidden header-pattern"
>
  <div class="container mx-auto px-4 relative z-10">
    <div class="navbar">
      <div class="flex-1">
        <a href="{base}/" class="flex items-center">
          <img src={logo} alt="Reham Diva" class="h-24 w-auto" />
        </a>
      </div>
      <LanguageToggle />
      <div
        class="flex-none sm:bg-rgHighlight sm:hover:bg-rgHighlightHover sm:min-w-44 px-4 py-2 rounded-3xl ml-2 sm:ml-4"
      >
        {#if $user && userFullName}
          <div class="dropdown dropdown-end mx-auto">
            <div
              class="flex items-center gap-2 cursor-pointer transition-all duration-300 group"
              on:click={toggleDropdown}
              on:keydown={handleKeyDown}
              role="button"
              tabindex="0"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <span class="sm:inline hidden">{userFullName}</span>
              <div
                class="w-10 h-10 rounded-full overflow-hidden transition-transform duration-300"
              >
                <img
                  src={avatar}
                  alt="User avatar"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
            {#if dropdownOpen}
              <ul
                class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-white rounded-box w-52 z-50"
              >
                <li>
                  <a
                    href="{base}/profile"
                    class="text-gray-700 hover:bg-purple-100 hover:text-purple-900"
                    >Profile</a
                  >
                </li>
                <li>
                  <button
                    on:click={handleLogout}
                    class="text-gray-700 w-full text-left hover:bg-purple-100 hover:text-purple-900"
                    >Logout</button
                  >
                </li>
              </ul>
            {/if}
          </div>
        {:else}
          <a href="{base}/login" class="mx-auto text-xl">Login</a>
        {/if}
      </div>
    </div>
  </div>
</header>

<style lang="postcss">
  .header-pattern::before,
  .header-pattern::after {
    content: " ";
    @apply absolute top-0 bg-cover opacity-20 pointer-events-none;
    background-image: url("$lib/assets/reham-assets/pattern-transparent.png");
    aspect-ratio: 1032 / 942;
  }

  .header-pattern::before {
    @apply left-0;
    width: 516px; /* 50% of original width */
    transform: translate(-18%, 8%) rotate(165deg);
  }

  .header-pattern::after {
    @apply right-0;
    width: 516px; /* 50% of original width */
    transform: translate(5%, -77%) rotate(270deg);
  }

  @media (max-width: 640px) {
    .header-pattern::before {
      display: none;
      width: 309.6px; /* 30% of original width */
      transform: translate(-25%, 15%) rotate(165deg);
    }

    .header-pattern::after {
      width: 330px;
      transform: translate(12%, -65%) rotate(270deg);
      /* display: none; */
    }
  }
</style>
