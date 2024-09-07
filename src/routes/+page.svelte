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
  import LanguageToggle from "$lib/components/LanguageToggle.svelte";

  addMessages("en", en);
  addMessages("ar", ar);

  init({
    fallbackLocale: "en",
    initialLocale: getLocaleFromNavigator(),
  });
</script>

<div class={$locale === "ar" ? "rtl" : "ltr"}>
  <Header />

  <main class="container mx-auto px-4 py-8 grid gap-4">
    <!-- Language toggle -->
    <div class="col-span-12 flex justify-end mb-4">
      <LanguageToggle />
    </div>

    <!-- Main content area -->
    <div class="col-span-12 md:col-span-9 lg:col-span-10">
      <h1>{$_("greeting")}</h1>
      <p>{$_("welcome")}</p>
      <VideoGrid />
    </div>
  </main>

  <Footer />
</div>

<style>
  .rtl {
    direction: rtl;
  }
  .ltr {
    direction: ltr;
  }
</style>
