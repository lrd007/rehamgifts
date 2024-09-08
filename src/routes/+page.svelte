<script lang="ts">
  import Footer from "$lib/components/Footer.svelte";
  import Header from "$lib/components/Header.svelte";
  import VideoGrid from "$lib/components/VideoGrid.svelte";
</script>

<div class="flex flex-col min-h-screen">
  <Header />

  <main class="relative overflow-hidden main-pattern">
    <div class="container mx-auto px-4 py-8 relative z-10">
      <!-- Your main content goes here -->
      <div class="col-span-12 md:col-span-9 lg:col-span-10">
        <VideoGrid />
      </div>
    </div>
  </main>

  <Footer />
</div>

<!-- <style lang="postcss">
  .main-pattern::before,
  .main-pattern::after {
    content: " ";
    @apply absolute bg-cover opacity-80 pointer-events-none;
    background-image: url("$lib/assets/reham-assets/pattern-primary.png");
    width: 363px;
    height: 332px;
  }

  .main-pattern::before {
    @apply left-0 top-1/4;
    transform: translate(-40%, -50%) rotate(30deg);
  }

  .main-pattern::after {
    @apply right-0 bottom-1/4;
    transform: translate(0%, 50%) rotate(-90deg);
  }

  @media (max-width: 640px) {
    .main-pattern::before {
      @apply left-0 top-0;
      transform: translate(-30%, -30%) rotate(30deg);
    }

    .main-pattern::after {
      @apply right-0 bottom-0;
      transform: translate(30%, 30%) rotate(-15deg);
    }
  }
</style> -->
