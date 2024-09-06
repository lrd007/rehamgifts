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

<header class="bg-[#5603AD] text-primary-content shadow-lg">
  <div class="container mx-auto px-4">
    <div class="navbar">
      <div class="flex-1">
        <a href="{base}/" class="flex items-center">
          <img src={logo} alt="Reham Diva" class="h-24 w-auto" />
        </a>
      </div>
      <div class="flex-none border-2 border-white p-4 rounded-xl">
        {#if $user && userFullName}
          <div class="dropdown dropdown-end flex items-center gap-1 md:gap-2">
            <span class="font-bold inline">{userFullName}</span>
            <button
              class="btn btn-ghost btn-circle avatar focus:outline-none flex items-center"
              on:click={toggleDropdown}
              on:keydown={handleKeyDown}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <div class="w-10 rounded-full">
                <img src={avatar} alt="User avatar" />
              </div>
            </button>
            {#if dropdownOpen}
              <ul
                class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <a href="{base}/profile" class="text-base-content">Profile</a>
                </li>
                <li>
                  <button
                    on:click={handleLogout}
                    class="text-base-content w-full text-left">Logout</button
                  >
                </li>
              </ul>
            {/if}
          </div>
        {:else}
          <a href="{base}/login" class="btn btn-ghost">Login</a>
        {/if}
      </div>
    </div>
  </div>
</header>
