<script lang="ts">
  import { base } from "$app/paths";
  import logo from "$lib/assets/rehamdiva-logo.png";
  import { userData } from "$lib/firebase";
  import avatar from "$lib/assets/avatar.png";
  import { signOut } from "firebase/auth";
  import { auth } from "$lib/firebase";
  import LanguageToggle from "./LanguageToggle.svelte";
  import { onMount } from "svelte";
  import { invalidateAll } from "$app/navigation";
  export let userID;
  console.log(userID);

  async function handleLogout() {
    try {
      await fetch("/api/signin", { method: "DELETE" });
      await signOut(auth);
      invalidateAll();
      // Optionally, you can redirect the user or update the UI here
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  let dropdownOpen = false;
  let isHeaderFixed = false;
  let headerRef: HTMLElement | null = null;
  let headerHeight = 0;

  function toggleDropdown() {
    dropdownOpen = !dropdownOpen;
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      toggleDropdown();
    }
  }

  onMount(() => {
    if (headerRef) {
      headerHeight = headerRef.offsetHeight;
    }

    const handleScroll = () => {
      if (window.pageYOffset > headerHeight) {
        isHeaderFixed = true;
      } else {
        isHeaderFixed = false;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  $: userFullName = $userData?.fullName.toUpperCase() || "";
</script>

<header
  bind:this={headerRef}
  class="bg-rgPrimary text-white font-bold shadow-lg relative"
  class:fixed={isHeaderFixed}
>
  <div class="header-pattern-container overflow-hidden absolute inset-0">
    <div class="header-pattern w-full h-full"></div>
  </div>
  <div class="container mx-auto px-4 relative">
    <div class="navbar">
      <div class="flex-1">
        <a href="{base}/" class="flex items-center">
          <img src={logo} alt="Reham Diva" class="h-24 w-auto" />
        </a>
      </div>
      <LanguageToggle />
      <div class="dropdown">
        {#if userID}
          <div>
            <div
              tabindex="0"
              role="button"
              class="btn m-1 flex-none bg-rgHighlight sm:hover:bg-rgHighlightHover rounded-3xl border-none"
            >
              <span class="sm:inline hidden min-w-[100px] text-white">
                {#if userFullName}
                  {userFullName}
                {:else}
                  <div class="skeleton h-1 w-28"></div>
                {/if}
              </span>
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

            <ul
              tabindex="0"
              class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <a
                  href="/login"
                  class="text-white-700 hover:bg-purple-100 hover:text-purple-900"
                  >Profile</a
                >
              </li>
              <li>
                <a
                  on:click={handleLogout}
                  class="text-white-700 w-full text-left hover:bg-purple-100 hover:text-purple-900"
                  >Logout</a
                >
              </li>
            </ul>
          </div>
        {:else}
          <div
            tabindex="1"
            role="button"
            class="text-white sm:min-w-44 btn m-1 flex-none bg-rgHighlight sm:hover:bg-rgHighlightHover rounded-3xl border-none"
          >
            <a href="{base}/login">Login</a>
          </div>
        {/if}
      </div>
    </div>
  </div>
</header>

{#if isHeaderFixed}
  <div style="height: {headerHeight}px;"></div>
{/if}

<style lang="postcss">
  .dropdowndiv {
    background-attachment: rgb(240 66 142 / var(--tw-bg-opacity));
  }

  .header-pattern-container {
    z-index: 0;
  }

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

  /* Styles for fixed header with slower animation */
  header {
    z-index: 1000;
    transition:
      transform 0.6s ease-in-out,
      box-shadow 0.6s ease-in-out;
    will-change: transform;
  }

  header.fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transform: translateY(0);
  }

  header:not(.fixed) {
    transform: translateY(0);
    box-shadow: none;
  }

  /* Ensure dropdown is not clipped */
  .dropdown {
    position: relative;
  }

  .dropdown-content {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 1001;
  }
</style>
