<script lang="ts">
  import { _ } from "svelte-i18n";
  import { locale, type Locale } from "svelte-i18n";

  function toggleLanguage(): void {
    $locale = ($locale === "en" ? "ar" : "en") as Locale;
  }
</script>

<main class={$locale === "ar" ? "rtl" : "ltr"}>
  <h1>{$_("greeting")}</h1>
  <p>{$_("welcome")}</p>
  <button on:click={toggleLanguage}>
    {$_("switchLanguage")}
  </button>
</main>

<style>
  .rtl {
    direction: rtl;
  }
  .ltr {
    direction: ltr;
  }
</style>
