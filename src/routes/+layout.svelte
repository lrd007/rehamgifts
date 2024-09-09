<script lang="ts">
  import Footer from "$lib/components/Footer.svelte";
  import Header from "$lib/components/Header.svelte";
  import "../app.css";
  import type { LayoutData } from "./$types";
  export let data: LayoutData;
</script>

<div class="flex flex-col min-h-screen font-didactGothic">
  <Header userID={data.userID} />

  <main class="flex-grow">
    <div class="container h-full mx-auto px-4 py-8">
      <slot />
    </div>
  </main>

  <Footer />
</div>
