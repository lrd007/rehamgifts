<script lang="ts">
  import "../app.css";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import Footer from "$lib/components/Footer.svelte";
  import Header from "$lib/components/Header.svelte";
  import { language } from "$lib/language";
</script>

<SvelteToast />

<div
  dir={$language === "ar" ? "rtl" : "ltr"}
  lang={$language}
  class="flex flex-col min-h-screen font-century"
>
  <Header />

  <main class="flex-grow">
    <div class="container h-full mx-auto px-4 py-8">
      <slot />
    </div>
  </main>

  <Footer />
</div>
