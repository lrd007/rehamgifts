<script lang="ts">
  import { base } from "$app/paths";
  import logo from "$lib/assets/rehamdiva-logo.png";
  import { user, userData, type UserData } from "$lib/firebase";
  import avatar from "$lib/assets/avatar.png";
  import { signOut } from "firebase/auth";
  import { auth } from "$lib/firebase";
  import LanguageToggle from "./LanguageToggle.svelte";
  import { onMount } from "svelte";
  import { invalidateAll, goto } from "$app/navigation";
  export let userID;

  async function handleLogout() {
    try {
      await signOut(auth);
      invalidateAll();
      goto(`${base}/`); // Redirect to home page after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  function handleProfileClick() {
    goto(`${base}/login`); // Navigate to the profile page
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

<header class="bg-[#da627d] text-white font-bold shadow-lg">
  <div class="container mx-auto px-4">
    <div class="navbar">
      <div class="flex-1">
        <a href="{base}/" class="flex items-center">
          <img src={logo} alt="Reham Diva" class="h-24 w-auto" />
        </a>
      </div>
      <div
        class="flex-none bg-[#EE8FA5] hover:bg-[#F6BBC9] min-w-44 px-4 py-2 rounded-3xl"
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
              <span class="inline">{userFullName}</span>
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
              <div
                class="dropdown-wrapper fixed inset-0 z-[1002]"
                on:click|self={toggleDropdown}
              >
                <ul
                  class="absolute right-4 mt-3 p-2 shadow menu menu-compact dropdown-content bg-white rounded-box w-52"
                >
                  <li>
                    <button
                      on:click|preventDefault|stopPropagation={handleProfileClick}
                      class="text-gray-700 w-full text-left hover:bg-purple-100 hover:text-purple-900 py-4 px-4"
                      >Profile</button
                    >
                  </li>
                  <li>
                    <button
                      on:click|preventDefault|stopPropagation={handleLogout}
                      class="text-gray-700 w-full text-left hover:bg-purple-100 hover:text-purple-900 py-4 px-4"
                      >Logout</button
                    >
                  </li>
                </ul>
              </div>
            {/if}
          </div>
        {:else}
          <a href="{base}/login" class="mx-auto text-xl">Login</a>
        {/if}
      </div>
    </div>
  </div>
</header>
