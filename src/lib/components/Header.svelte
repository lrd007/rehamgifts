<script lang="ts">
  import { base } from "$app/paths";
  import logo from "$lib/assets/rehamdiva-logo.png";
  import { user, userData, type UserData } from "$lib/firebase";
  import avatar from "$lib/assets/avatar.png";
  import { signOut } from "firebase/auth";
  import { auth } from "$lib/firebase";

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

<header class="bg-black text-primary-content shadow-lg">
  <div class="container mx-auto px-4">
    <div class="navbar">
      <div class="flex-1">
        <a href="{base}/" class="flex items-center">
          <img src={logo} alt="Reham Diva" class="h-24 w-auto" />
        </a>
      </div>
      <div class="flex-none">
        {#if $user && userFullName}
          <div class="dropdown dropdown-end">
            <div
              class="flex items-center gap-2 cursor-pointer p-2 rounded-full transition-all duration-300 hover:bg-cyan-600 group border-2 border-white"
              on:click={toggleDropdown}
              on:keydown={handleKeyDown}
              role="button"
              tabindex="0"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <span
                class="font-bold inline username group-hover:text-purple-100"
                >{userFullName}</span
              >
              <div
                class="w-10 h-10 rounded-full overflow-hidden transition-transform duration-300 group-hover:rotate-[360deg]"
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
                class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-white rounded-box w-52"
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
          <a
            href="{base}/login"
            class="btn btn-ghost hover:bg-purple-600 hover:text-white transition-colors duration-300"
            >Login</a
          >
        {/if}
      </div>
    </div>
  </div>
</header>

<style>
  .username {
    font-style: italic;
    color: white;
  }
</style>
