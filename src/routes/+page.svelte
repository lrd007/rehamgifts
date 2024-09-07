<script lang="ts">
  import { _ } from "svelte-i18n";
  import { locale } from "svelte-i18n";
  import Footer from "$lib/components/Footer.svelte";
  import Header from "$lib/components/Header.svelte";
  import VideoGrid from "$lib/components/VideoGrid.svelte";

  // Initialize i18n (you should do this in a separate file, e.g., src/i18n.ts)
  import { addMessages, init, getLocaleFromNavigator } from "svelte-i18n";
  import en from "../locales/en.json";
  import ar from "../locales/ar.json";

  addMessages("en", en);
  addMessages("ar", ar);

  init({
    fallbackLocale: "en",
    initialLocale: getLocaleFromNavigator(),
  });

  function toggleLanguage(): void {
    $locale = $locale === "en" ? "ar" : "en";
  }
</script>

<Header />

<main class="container mx-auto px-4 py-8 grid gap-4">
  <!-- Language toggle -->
  <div class="col-span-12 flex justify-end mb-4">
    <button
      on:click={toggleLanguage}
      class="px-4 py-2 bg-blue-500 text-white rounded"
    >
      {$_("switchLanguage")}
    </button>
  </div>

  <!-- Main content area -->
  <div class="col-span-12 md:col-span-9 lg:col-span-10">
    <h1>{$_("greeting")}</h1>
    <p>{$_("welcome")}</p>
    <VideoGrid />
  </div>
</main>

<Footer />
