<script lang="ts">
  import "../app.css";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import { language } from "$lib/stores/language";
  import { Header, Footer } from "$lib/components";
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
