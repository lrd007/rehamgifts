<!-- Header.svelte -->
<script lang="ts">
  import { base } from "$app/paths";
  import { language, t } from "$lib/stores/language";
  import logoEn from "$lib/assets/reham-assets/branding/logo_white_name_2.png";
  import logoAr from "$lib/assets/reham-assets/branding/reham-arabic-logo.svg";
  import { AnimatedButton, LanguageToggle, UserAuth } from "..";
  $: logo = $language === "ar" ? logoAr : logoEn;
</script>

<div class="sticky top-0 z-50 bg-rgPrimary shadow-lg">
  <div class="container mx-auto px-4">
    <div class="navbar font-bold relative">
      <div class="navbar-start">
        <a href="{base}/" class="flex flex-col items-center">
          <img src={logo} alt={$t("rehamDivaLogo")} class="h-auto w-12" />
          <span class="text-xs text-white font-century-bold leading-tight"
            >{$t("house")}</span
          >
        </a>
      </div>
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1 text-white text-base">
          <li><a href="{base}/">{$t("home")}</a></li>
          <li><a href="{base}/about">{$t("about")}</a></li>
          <li><a href="{base}/contact">{$t("contact")}</a></li>
        </ul>
      </div>
      <div class="navbar-end flex gap-2 md:gap-4">
        <AnimatedButton buttonText={$t("programs")} link="https://reham.com/" />
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
