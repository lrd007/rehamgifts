<!-- Header.svelte -->
<script lang="ts">
  import { base } from "$app/paths";
  import logo from "$lib/assets/rehamdiva-arabic-logo.svg";
  import AnimatedButton from "./AnimatedButton.svelte";
  import LanguageToggle from "./LanguageToggle.svelte";
  // import LanguageToggle from "./LanguageToggle.svelte";
  import UserAuth from "./UserAuth.svelte";
</script>

<div class="sticky top-0 z-50 bg-rgPrimary">
  <div class="container mx-auto px-4">
    <div class="navbar font-bold shadow-lg relative">
      <div class="navbar-start">
        <a href="{base}/" class="flex items-center">
          <img src={logo} alt="Reham Diva" class="h-20 w-auto" />
        </a>
      </div>
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1 text-white text-base">
          <li><a href="{base}/">Home</a></li>
          <li><a href="{base}/about">About</a></li>
          <li><a href="{base}/contact">Contact</a></li>
        </ul>
      </div>
      <div class="navbar-end flex gap-4">
        <AnimatedButton buttonText="Programs"/>
        <LanguageToggle />
        <UserAuth />
      </div>
    </div>
  </div>
  <div class="absolute inset-0 z-[-1] overflow-hidden">
    <div class="header-pattern w-full h-full"></div>
  </div>
</div>

<style lang="postcss">
  .header-pattern::before,
  .header-pattern::after {
    content: " ";
    @apply absolute top-0 bg-cover opacity-20 pointer-events-none;
    background-image: url("$lib/assets/reham-assets/patterns/pattern-transparent.png");
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
    }
  }
</style>
